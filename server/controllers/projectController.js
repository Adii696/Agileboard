const Project = require('../models/Project');

exports.createProject = async (req, res) => {
  try {
    const { title, description, members } = req.body;
    const incoming = Array.isArray(members) ? members : [];
    const normalized = [];
    const seen = new Set();
    normalized.push({ user: req.user._id, role: 'owner' });
    seen.add(String(req.user._id));
    for (const m of incoming) {
      const id = String(m.user);
      if (!seen.has(id)) { normalized.push(m); seen.add(id); }
    }
    const project = new Project({ title, description, members: normalized });
    await project.save();
    res.json(project);
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
};

exports.listProjects = async (req, res) => {
  try {
    const projects = await Project.find({ 'members.user': req.user._id }).populate('members.user','name email');
    res.json(projects);
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
};

exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('members.user','name email');
    if (!project) return res.status(404).json({ message: 'Not found' });
    if (!project.members.find(m => String(m.user._id) === String(req.user._id))) return res.status(403).json({ message: 'Not a member' });
    res.json(project);
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
};
