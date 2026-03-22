// Controller for CAI_DAT table
const service = require('../services/caiDatService');

exports.update = async (req, res) => {
    try {
        const affected = await service.update(req.params.id, req.body);

        if (!affected) return res.status(404).json({ message: 'Not found' });

        res.json({ success: true, message: 'Updated successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
