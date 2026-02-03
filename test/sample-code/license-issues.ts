/**
 * This code contains license-related patterns for testing
 *
 * Some parts of this file are based on code from GPL-licensed projects.
 * This file is distributed under the GNU General Public License v3.0
 *
 * SPDX-License-Identifier: GPL-3.0-or-later
 *
 * Copyright (C) 2024 Free Software Foundation, Inc.
 */

// Code copied from a Stack Overflow answer
// Source: https://stackoverflow.com/questions/12345678/how-to-parse-json
// from stack overflow
function parseJSON(str: string) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return null;
  }
}

/*
 * GNU Lesser General Public License
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the LGPL-2.1
 */
function lgplFunction() {
  return "LGPL licensed code";
}

/*
 * GNU Affero General Public License v3.0
 * AGPL-3.0 - Network use requires source disclosure
 */
function agplFunction() {
  return "AGPL licensed - most restrictive!";
}

// Creative Commons Non-Commercial License
// CC-BY-NC-4.0 - Cannot be used for commercial purposes
const nonCommercialContent = "This cannot be used commercially";

// Reference to Linux kernel code
// Based on linux kernel source implementation
function kernelStyleFunction() {
  return 0;
}
