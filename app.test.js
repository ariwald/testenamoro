import React from "react";
import axios from "./axios";
import { render, waitForElements } from "@testing-library/react";
import App from './app';

jest.mock(".(axios");

test('after user data is retrieved a div appear, async' () =>{
    axios.get.mockResolvedValue({
        data: {
            id: 11,
            first: "f"
        }
    });
    const {container} = render(</ App>);
});

console.log();
