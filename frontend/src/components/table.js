"use client";

import React from "react";

export default class Table extends React.Component {
  render() {
    return (
      <div className="relative h-min overflow-x-auto rounded-lg drop-shadow">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700">
            <tr>
              {this.props.thead_list.map((thead) => (
                <th scope="col" className="px-6 py-3" key={thead}>
                  {thead}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {this.props.enable_th
              ? this.props.tbody_list.map((tbody, index) => (
                  <tr className="bg-white border-b" key={index}>
                    {tbody.map((td, index) => {
                      if (index == 0) {
                        return (
                          <th
                            scope="row"
                            className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                            key={td}
                          >
                            {td}
                          </th>
                        );
                      } else {
                        return (
                          <td className="px-6 py-2" key={td}>
                            {td}
                          </td>
                        );
                      }
                    })}
                  </tr>
                ))
              : this.props.tbody_list.map((tbody, index) => (
                  <tr className="bg-white border-b" key={index}>
                    {tbody.map((td) => (
                      <td className="px-6 py-2" key={td}>
                        {td}
                      </td>
                    ))}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    );
  }
}
