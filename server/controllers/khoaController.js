// Controller for KHOA table
const service = require('../services/khoaService');

exports.getAll = async (req, res) => {
    try {
        const data = await service.getAll();
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const data = await service.getById(req.params.id);

        if (!data) return res.status(404).json({ message: 'Not found' });

        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const data = await service.create(req.body);
        res.status(201).json({ success: true, data });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const affected = await service.update(req.params.id, req.body);

        if (!affected) return res.status(404).json({ message: 'Not found' });

        res.json({ success: true, message: 'Updated successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const affected = await service.delete(req.params.id);

        if (!affected) return res.status(404).json({ message: 'Not found' });

        res.json({ success: true, message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};