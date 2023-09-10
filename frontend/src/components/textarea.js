"use client";

import React from "react";

export default class TextArea extends React.Component {
  render() {
    return (
      <div className="">
        <label className="block mb-2 text-sm font-medium text-gray-900">
          {this.props.label}
        </label>
        <textarea
          id="message"
          name={this.props.name}
          rows={this.props.rows}
          className={
            this.props.error
              ? "block p-2.5 w-full text-sm leading-6 text-gray-900 bg-gray-50 rounded-lg border border-red-500 focus:ring-1 focus:ring-red-500 focus:border-red-500 focus:outline-none"
              : "block p-2.5 w-full text-sm leading-6 text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-1 focus:ring-blue-500  focus:border-blue-500 focus:outline-none"
          }
          placeholder={this.props.placeholder}
          value={this.props.value}
          onChange={this.props.handle_change}
        ></textarea>
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
