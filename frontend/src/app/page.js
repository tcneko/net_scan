"use client";

import React from "react";

// Components
import Alert from "../components/alert";
import Button from "../components/button";
import Input from "../components/input";
import ListGroup from "../components/listgroup";
import Table from "../components/table";
import TextArea from "../components/textarea";

class NetScanInput extends React.Component {
  render() {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex flex-col">
          <TextArea
            label="Scan Prefixes"
            name="prefix_list_input"
            rows="20"
            placeholder={"98.98.98.0/24\n128.1.0.0/24\n..."}
            handle_change={this.props.handle_change}
            value={this.props.prefix_list_value}
            error={this.props.prefix_list_error}
            tip={this.props.prefix_list_tip}
          />
        </div>
        <div className="mt-4 flex">
          <Input
            label="Split to"
            type="number"
            name="split_to_input"
            placeholder="24"
            handle_change={this.props.handle_change}
            error={this.props.split_to_error}
            tip={this.props.split_to_tip}
            value={this.props.split_to_value}
          />
        </div>
        <div className="mt-4">
          <Button
            label="Scan"
            name="query_button"
            handle_click={this.props.handle_click}
            loading={this.props.query_loading}
          />
        </div>
      </div>
    );
  }
}

class NetScanOutput extends React.Component {
  render() {
    return (
      <div className="flex max-md:flex-col gap-4">
        <div className="flex md:flex-col gap-4">
          <ListGroup
            item_list={Object.keys(this.props.scan_network_result).map((x) => {
              if (this.props.scan_network_result[x].alive_addr_count == 0) {
                return { key: x, id: x, label: x, state: false };
              } else {
                return { key: x, id: x, label: x, state: true };
              }
            })}
            name="result_list_button"
            selected_item_id={this.props.selected_result}
            handle_click={this.props.handle_click}
          />
          <div>
            <Button
              label="Back"
              name="back_button"
              handle_click={this.props.handle_click}
              loading={false}
            />
          </div>
        </div>
        <div>
          <Table
            enable_th={true}
            thead_list={["Summary", ""]}
            tbody_list={[
              [
                "Alive count",
                this.props.scan_network_result[this.props.selected_result]
                  .alive_addr_count,
              ],
              [
                "Dead count",
                this.props.scan_network_result[this.props.selected_result]
                  .dead_addr_count,
              ],
              [
                "Min RRT",
                this.props.scan_network_result[this.props.selected_result]
                  .min_rrt + " ms",
              ],
              [
                "Average RRT",
                this.props.scan_network_result[this.props.selected_result]
                  .avg_rrt + " ms",
              ],
              [
                "Max RRT",
                this.props.scan_network_result[this.props.selected_result]
                  .max_rrt + " ms",
              ],
            ]}
          />
        </div>
        <div className="flex gap-4">
          <Table
            enable_th={false}
            thead_list={["Alive Address"]}
            tbody_list={this.props.scan_network_result[
              this.props.selected_result
            ].alive_addr_list.map((x) => [x])}
          />
          <Table
            enable_th={false}
            thead_list={["Dead Address"]}
            tbody_list={this.props.scan_network_result[
              this.props.selected_result
            ].dead_addr_list.map((x) => [x])}
          />
        </div>
      </div>
    );
  }
}

class NetScan extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // UI mode
      ui_mode: "input",
      alert_display: false,
      alert_tip: "",

      // NetScanInput state
      // form data
      prefix_list: ["98.98.98.0/24", "128.1.0.0/24"],
      split_to: 24,
      // input value
      prefix_list_value: "98.98.98.0/24\n128.1.0.0/24\n...",
      split_to_value: "24",
      // input error status
      prefix_list_error: false,
      split_to_error: false,
      // input error tip
      prefix_list_error_tip: "",
      split_to_error_tip: "",
      // button status
      query_loading: false,

      // NetScanOutput state
      scan_network_result: {},

      // listgroup status
      selected_result: "",
    };

    this.regexp_prefix = new RegExp(
      "(" +
        "(?:(?:(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9]).){3,3}(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/(?:3[012]|2[0-9]|1[6-9])" +
        // "|" +
        // "(?:(?:(?:(?:(?:[0-9a-fA-F]){1,4}):){1,4}:[^s:](?:(?:(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9]).){3,3}(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9])))|(?:::(?:ffff(?::0{1,4}){0,1}:){0,1}[^s:](?:(?:(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9]).){3,3}(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9])))|(?:fe80:(?::(?:(?:[0-9a-fA-F]){1,4})){0,4}%[0-9a-zA-Z]{1,})|(?::(?:(?::(?:(?:[0-9a-fA-F]){1,4})){1,7}|:))|(?:(?:(?:[0-9a-fA-F]){1,4}):(?:(?::(?:(?:[0-9a-fA-F]){1,4})){1,6}))|(?:(?:(?:(?:[0-9a-fA-F]){1,4}):){1,2}(?::(?:(?:[0-9a-fA-F]){1,4})){1,5})|(?:(?:(?:(?:[0-9a-fA-F]){1,4}):){1,3}(?::(?:(?:[0-9a-fA-F]){1,4})){1,4})|(?:(?:(?:(?:[0-9a-fA-F]){1,4}):){1,4}(?::(?:(?:[0-9a-fA-F]){1,4})){1,3})|(?:(?:(?:(?:[0-9a-fA-F]){1,4}):){1,5}(?::(?:(?:[0-9a-fA-F]){1,4})){1,2})|(?:(?:(?:(?:[0-9a-fA-F]){1,4}):){1,6}:(?:(?:[0-9a-fA-F]){1,4}))|(?:(?:(?:(?:[0-9a-fA-F]){1,4}):){1,7}:)|(?:(?:(?:(?:[0-9a-fA-F]){1,4}):){7,7}(?:(?:[0-9a-fA-F]){1,4})))/(?:12[0-8]|1[01][0-9]|[1-9][0-9]|[1-9])" +
        ")"
    );

    this.extract_prefix = this.extract_prefix.bind(this);

    this.handle_change = this.handle_change.bind(this);
    this.handle_click = this.handle_click.bind(this);

    this.scan_network = this.scan_network.bind(this);
  }

  extract_prefix(raw_prefix_list) {
    let prefix_list = [];
    for (let line of raw_prefix_list) {
      let re_out_prefix_list = this.regexp_prefix.exec(line);
      if (re_out_prefix_list) {
        prefix_list.push(re_out_prefix_list[0]);
      }
    }
    return prefix_list;
  }

  handle_change(event) {
    switch (event.target.name) {
      case "prefix_list_input":
        {
          let value = event.target.value;
          let prefix_list = this.extract_prefix(value.split("\n"));
          let error;
          let error_tip;
          if (value && prefix_list.length > 0) {
            error = false;
            error_tip = "";
          } else {
            error = true;
            error_tip = "Please enter at least one valid prefix, one per line";
          }
          this.setState({
            prefix_list: prefix_list,
            prefix_list_value: value,
            prefix_list_error: error,
            prefix_list_error_tip: error_tip,
          });
        }
        break;
      case "split_to_input":
        {
          let value = event.target.value;
          let split_to = Number(value);
          let error;
          let error_tip;
          if (
            value &&
            Number.isInteger(split_to) &&
            split_to >= 0 &&
            split_to <= 32
          ) {
            error = false;
            error_tip = "";
          } else {
            error = true;
            error_tip = "Please input a valid number (0 ~ 32)";
          }
          this.setState({
            split_to: split_to,
            split_to_value: value,
            split_to_error: error,
            split_to_error_tip: error_tip,
          });
        }
        break;
    }
  }

  async handle_click(event) {
    switch (event.currentTarget.getAttribute("name")) {
      case "query_button":
        this.setState({ query_loading: true });
        await this.scan_network();
        this.setState({ query_loading: false });
        break;
      case "back_button":
        this.setState({ ui_mode: "input" });
        break;
      case "alert_button":
        this.setState({ alert_display: false });
        break;
      case "result_list_button":
        this.setState({
          selected_result: event.currentTarget.getAttribute("id"),
        });
        break;
    }
  }

  async scan_network() {
    try {
      let response = await fetch("/api/v1/scan_network", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prefix_list: this.state.prefix_list,
          split_to: this.state.split_to,
        }),
      });
      let json_response = await response.json();
      if (json_response.status == "success") {
        this.setState({
          scan_network_result: Object.fromEntries(
            json_response.result_list.map((x) => [
              x.prefix,
              Object.keys(x)
                .filter((key) => key != "prefix")
                .reduce((obj, key) => {
                  obj[key] = x[key];
                  return obj;
                }, {}),
            ])
          ),
          selected_result: json_response.result_list[0].prefix,
          ui_mode: "output",
          alert_display: false,
          alert_tip: "",
        });
      } else {
        if (json_response.reason == "form_error") {
          this.setState({
            ui_mode: "input",
            alert_display: true,
            alert_tip: "Invalid input, please correct the input value",
          });
        } else {
          this.setState({
            ui_mode: "input",
            alert_display: true,
            alert_tip: "Unknown error, please try again later",
          });
        }
      }
    } catch (error) {
      console.log(error);
      this.setState({
        ui_mode: "input",
        // alert_display: true,
        alert_tip: "Unknown error, please try again later",
      });
    }
  }

  render() {
    return (
      <div>
        <div className="">
          {this.state.ui_mode == "input" ? (
            <NetScanInput
              scan_network={this.scan_network}
              handle_change={this.handle_change}
              handle_click={this.handle_click}
              // input value
              prefix_list_value={this.state.prefix_list_value}
              split_to_value={this.state.split_to_value}
              // input error status
              prefix_list_error={this.state.prefix_list_error}
              split_to_error={this.state.split_to_error}
              // input error tip
              prefix_list_tip={
                this.state.prefix_list_error
                  ? this.state.prefix_list_error_tip
                  : "Maximum 256 * /24 per scan, extracted prefixes: " + this.state.prefix_list.length
              }
              split_to_tip={
                this.state.split_to_error ? this.state.split_to_error_tip : ""
              }
              // button status
              query_loading={this.state.query_loading}
            />
          ) : (
            <NetScanOutput
              scan_network_result={this.state.scan_network_result}
              selected_result={this.state.selected_result}
              handle_click={this.handle_click}
            />
          )}
          {this.state.ui_mode == "output" ? null : null}
        </div>
        {this.state.alert_display ? (
          <div className="fixed bottom-4 w-auto">
            <Alert
              label={this.state.alert_tip}
              button_name="alert_button"
              handle_click={this.handle_click}
            />
          </div>
        ) : null}
        <div className="h-16"></div>
      </div>
    );
  }
}

export default function Home() {
  return (
    <main>
      <div className="mx-auto max-w-screen-xl py-4 px-4 sm:px-6 lg:px-8">
        <NetScan />
      </div>
    </main>
  );
}
