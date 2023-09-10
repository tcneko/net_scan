"use client";

import React from "react";

export default class Input extends React.Component {
  render() {
    return (
      <div className="">
        <label
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          {this.props.label}
        </label>
        <input
          type={this.props.type}
          name={this.props.name}
          className={
            this.props.error
              ? "bg-gray-50 border border-red-500 text-gray-900 placeholder-gray-700 text-sm rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 focus:outline-none block w-full p-2.5"
              : "bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-700 text-sm rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none block w-full p-2.5"
          }
          placeholder={this.props.placeholder}
          value={this.props.value}
          onChange={this.props.handle_change}
        />
        <p
          className={
            this.props.error
              ? "mt-2 text-xs text-red-600"
              : "mt-2 text-xs text-gray-900"
          }
        >
          {this.props.tip ? this.props.tip : ""}
        </p>
      </div>
    );
  }
}
