// From https://github.com/n3r4zzurr0/svg-spinners/blob/main/svg-css/pulse.svg

// The MIT License (MIT)

import html from "../html/html-tag.mjs";

// Copyright (c) Utkarsh Verma

// Permission is hereby granted, free of charge, to any person obtaining a copy of
// this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to
// use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
// the Software, and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
// FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
// COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
// IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

export default html`<svg
  width="24"
  height="24"
  viewBox="0 0 24 24"
  xmlns="http://www.w3.org/2000/svg"
>
  <style>
    .spinner_7NYg {
      animation: spinner_0KQs 1.2s cubic-bezier(0.52, 0.6, 0.25, 0.99) infinite;
    }
    @keyframes spinner_0KQs {
      0% {
        r: 0;
        opacity: 1;
      }
      100% {
        r: 11px;
        opacity: 0;
      }
    }
  </style>
  <circle class="spinner_7NYg" cx="12" cy="12" r="0" />
</svg>`;
