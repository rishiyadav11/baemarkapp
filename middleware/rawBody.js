// middleware/rawBody.js
const express = require('express');

const rawBodyMiddleware = (req, res, next) => {
  if (req.originalUrl === '/api/payments/webhook') {
    req.setEncoding('utf8');
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => {
      req.rawBody = data;
      next();
    });
  } else {
    next();
  }
};

module.exports = rawBodyMiddleware;
