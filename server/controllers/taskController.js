const Task = require('../models/Task');
const Project = require('../models/Project');

async function getMember(projectId, userId){
  const p = await Project.findById(projectId);
  if (!p) return null;
  return p.members.find(m => String(m.user) === String(userId));
}

exports.createTask = async (req, res) => {
  try {
    const { title, description, project, assignee } = req.body;
    if (!title || !project) return res.status(400).json({ message: 'Missing fields' });
    const member = await getMember(project, req.user._id);
    if (!member) return res.status(403).json({ message: 'Not a project member' });
    if (!['owner','editor'].includes(member.role)) return res.status(403).json({ message: 'Insufficient role' });
    if (assignee) {
      const p = await Project.findById(project);
      const mem = p?.members.find(m => String(m.user) === String(assignee));
      if (!mem) return res.status(400).json({ message: 'Assignee must be a project member' });
    }
    const task = new Task({ title, description, project, assignee, createdBy: req.user._id });
    await task.save();
    req.app.get('io')?.to(String(project)).emit('task:created', task);
    res.json(task);
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    const member = await getMember(task.project, req.user._id);
    if (!member) return res.status(403).json({ message: 'Not a project member' });
    if (!['owner','editor'].includes(member.role)) return res.status(403).json({ message: 'Insufficient role' });
    if (req.body.status && !['todo','inprogress','done'].includes(req.body.status)) return res.status(400).json({ message: 'Invalid status' });
    Object.assign(task, req.body);
    await task.save();
    req.app.get('io')?.to(String(task.project)).emit('task:updated', task);
    res.json(task);
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
};

exports.listProjectTasks = async (req, res) => {
  try {
    const member = await getMember(req.params.projectId, req.user._id);
    if (!member) return res.status(403).json({ message: 'Not a member' });
    const tasks = await Task.find({ project: req.params.projectId }).populate('assignee','name email');
    res.json(tasks);
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
};
