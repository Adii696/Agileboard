const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const projectCtrl = require('../controllers/projectController');

router.post('/', authenticate, projectCtrl.createProject);
router.get('/', authenticate, projectCtrl.listProjects);
router.get('/:id', authenticate, projectCtrl.getProject);

module.exports = router;
