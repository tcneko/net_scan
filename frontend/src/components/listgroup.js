"use client";

import React from "react";

export default class ListGroup extends React.Component {
  render() {
    return (
      <div className="w-48 text-sm font-medium text-gray-900 bg-white rounded-lg drop-shadow">
        {this.props.item_list.map((x) => (
          <button
            type="button"
            key={x.key}
            name={this.props.name}
            id={x.id}
            className={
              x.id == this.props.selected_item_id
                ? "w-full px-4 py-2 text-white bg-blue-500 font-medium text-left border-b border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 hover:text-blue-500 focus:outline-none"
                : "w-full px-4 py-2 font-medium text-left border-b border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 hover:text-blue-500 focus:outline-none"
            }
            onClick={this.props.handle_click}
          >
            {x.state ? (
              <svg
                className="inline w-2 h-2 ml-2 text-lime-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
              </svg>
            ) : (
              <svg
              className="inline w-2 h-2 ml-2 text-red-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
              </svg>
            )}
            <span className="ml-2">{x.label}</span>
          </button>
        ))}
      </div>
    );
  }
}
