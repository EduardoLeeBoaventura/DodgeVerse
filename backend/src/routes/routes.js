require('../database');
const express = require('express');
const router = express.Router();
const routes = require('./teste');
const cors = require('cors');
const path = require('path');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(cors());