#!/usr/bin/env python3


# author: tcneko <tcneko@outlook.com>
# start from: 2023.08
# last test environment: ubuntu 22.04
# description:


# import
import asyncio
import re
import ipaddress

from fastapi import FastAPI
from pydantic import BaseModel


# variable
cfg = {}
db = {}
addr_domain_record = {}
dns_api_lib = {}


# function
async def fping(prefix: str):
    ip_network = ipaddress.ip_network(prefix)
    address_count = ip_network.num_addresses
    network_address = str(ip_network.network_address)
    broadcast_address = str(ip_network.broadcast_address)
    fping = await asyncio.create_subprocess_exec(
        "fping",
        "-sq",
        "-c5",
        "-t1000",
        "-g",
        network_address,
        broadcast_address,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE,
    )
    fping_stderr = (await fping.communicate())[1]
    fping_out_list = fping_stderr.decode("utf-8").split("\n")
    fping_out_ip_list = fping_out_list[-17-address_count:-17]
    fping_out_summary_list = fping_out_list[-16:-1]
    alive_addr_list = []
    dead_addr_list = []
    for line in fping_out_ip_list:
        if line[-1:] == "%":
            dead_addr_list.append(line.split(" ")[0])
        else:
            alive_addr_list.append(line.split(" ")[0])
    alive_count, dead_count, unknown_count = map(
        lambda x: int(x.strip().split(" ")[0]), fping_out_summary_list[-14:-11]
    )
    min_rrt, avg_rrt, max_rrt = map(
        lambda x: float(x.strip().split(" ")[0]), fping_out_summary_list[-5:-2]
    )
    return {
        "prefix": prefix,
        "alive_addr_list": alive_addr_list,
        "dead_addr_list": dead_addr_list,
        "alive_addr_count": alive_count,
        "dead_addr_count": dead_count,
        "min_rrt": min_rrt,
        "avg_rrt": avg_rrt,
        "max_rrt": max_rrt,
    }


def verify_prefix(prefix: str, max_ipv4_prefix_len: int):
    try:
        prefix = ipaddress.ip_network(prefix)
        if prefix.version == 4 and prefix.prefixlen >= max_ipv4_prefix_len:
            return True
    except:
        return False


def extract_prefix(raw_prefix_list: list, max_ipv4_prefix_len: int):
    regexp_ipv4_prefix = r"(?:(?:(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/(?:3[012]|[12][0-9]|[1-9])"
    # regexp_ipv6_prefix = r"(?:(?:(?:(?:(?:[0-9a-fA-F]){1,4}):){1,4}:[^\s:](?:(?:(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9])))|(?:::(?:ffff(?::0{1,4}){0,1}:){0,1}[^\s:](?:(?:(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9])))|(?:fe80:(?::(?:(?:[0-9a-fA-F]){1,4})){0,4}%[0-9a-zA-Z]{1,})|(?::(?:(?::(?:(?:[0-9a-fA-F]){1,4})){1,7}|:))|(?:(?:(?:[0-9a-fA-F]){1,4}):(?:(?::(?:(?:[0-9a-fA-F]){1,4})){1,6}))|(?:(?:(?:(?:[0-9a-fA-F]){1,4}):){1,2}(?::(?:(?:[0-9a-fA-F]){1,4})){1,5})|(?:(?:(?:(?:[0-9a-fA-F]){1,4}):){1,3}(?::(?:(?:[0-9a-fA-F]){1,4})){1,4})|(?:(?:(?:(?:[0-9a-fA-F]){1,4}):){1,4}(?::(?:(?:[0-9a-fA-F]){1,4})){1,3})|(?:(?:(?:(?:[0-9a-fA-F]){1,4}):){1,5}(?::(?:(?:[0-9a-fA-F]){1,4})){1,2})|(?:(?:(?:(?:[0-9a-fA-F]){1,4}):){1,6}:(?:(?:[0-9a-fA-F]){1,4}))|(?:(?:(?:(?:[0-9a-fA-F]){1,4}):){1,7}:)|(?:(?:(?:(?:[0-9a-fA-F]){1,4}):){7,7}(?:(?:[0-9a-fA-F]){1,4})))/(?:12[0-8]|1[01][0-9]|[1-9][0-9]|[1-9])"
    # regexp_prefix = "({}|{})".format(regexp_ipv4_prefix, regexp_ipv6_prefix)
    regexp_prefix = regexp_ipv4_prefix
    prefix_list_s1 = []
    for raw_prefix in raw_prefix_list:
        match = re.search(regexp_prefix, raw_prefix)
        if match:
            if verify_prefix(match.group(), max_ipv4_prefix_len):
                prefix_list_s1.append(match.group())
    prefix_list = list(set(prefix_list_s1))
    return prefix_list


def split_prefix(raw_prefix_list: list[str], split_to: int):
    prefix_list = []
    for raw_prefix in raw_prefix_list:
        prefix = ipaddress.ip_network(raw_prefix)
        if prefix.prefixlen < split_to:
            prefix_list.extend(
                list(
                    map(
                        lambda x: str(x),
                        prefix.subnets(new_prefix=split_to),
                    )
                )
            )
        else:
            prefix_list.append(raw_prefix)
    return prefix_list


app = FastAPI()


class ScanNetworkBody(BaseModel):
    prefix_list: list[str]
    split_to: int


@app.post("/api/v1/scan_network")
async def api_scan_network(body: ScanNetworkBody):
    if len(body.prefix_list) <= 0 or body.split_to < 0 or body.split_to > 32:
        json_msg = {"status": "fail", "reason": "form_error"}
        return json_msg

    prefix_list_s1 = extract_prefix(body.prefix_list, 16)
    prefix_list = split_prefix(prefix_list_s1, body.split_to)

    if len(prefix_list) <= 0:
        json_msg = {"status": "fail", "reason": "form_error"}
        return json_msg

    task_list = []
    async with asyncio.TaskGroup() as task_group:
        for prefix in prefix_list:
            task_list.append(task_group.create_task(fping(prefix)))
    result_list = []
    try:
        for task in task_list:
            if not task.exception():
                result_list.append(task.result())
    except:
        result_list = []
    if result_list:
        json_msg = {"status": "success", "result_list": result_list}
    else:
        json_msg = {"status": "fail", "reason": "internal_error"}
    return json_msg
