const Discussion = require('../models/Discussion');

exports.createDiscussion = async (req, res) => {
    const { text, hashtags } = req.body;
    let image;

    if (req.file) {
        image = req.file.path;
    }

    const hashtagsArray = hashtags.split(',').map(tag => tag.trim());

    try {
        const discussion = new Discussion({
            text,
            image,
            hashtags:hashtagsArray,
            createdBy: req.user.id
        });
        await discussion.save();
        res.status(201).json(discussion);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// exports.updateDiscussion = async (req, res) => {

exports.updateDiscussion = async (req, res) => {
    try {
        // Get the discussion by ID
        console.log(req.body);
        
        const discussion = await Discussion.findById({_id:req.params.id});
        
        // Check if discussion exists
        if (!discussion) {
            return res.status(404).json({ error: 'Discussion not found' });
        }
        
        // Check if the logged-in user is the creator of the discussion
        console.log(discussion.createdBy,req.user.id)
        if (discussion.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized action' });
        }

        // Update the discussion
        const updates = { ...req.body };
        const hashtagsArray = req.body.hashtags.split(',').map(tag => tag.trim());
        updates.hashtags = hashtagsArray
        // Check if a new image file is provided
        if (req.file) {
            updates.image = req.file.path;
        }
        const updatedDiscussion = await Discussion.findByIdAndUpdate(
            req.params.id, 
            updates, 
            { new: true} // `runValidators` ensures that schema validation is performed on the update
        );
        
        res.json(updatedDiscussion);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



exports.deleteDiscussion = async (req, res) => {
    try {

        const discussion = await Discussion.findById({_id:req.params.id});
        
        // Check if discussion exists
        if (!discussion) {
            return res.status(404).json({ error: 'Discussion not found' });
        }
        
        // Check if the logged-in user is the creator of the discussion
        if (discussion.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized action' });
        }
        await Discussion.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Discussion deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.listDiscussions = async (req, res) => {
    try {
        const discussions = await Discussion.find({}).populate('createdBy', 'name').populate('comments.user', 'name');
        res.json(discussions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



exports.getDiscussionsByTags = async (req, res) => {
    const { category } = req.query; 

    // Ensure tags are an array
    const tagsArray = category ? category.split(',').map(tag => tag.trim()) : [];

    try {
        // Find discussions with any of the specified tags
        const discussions = await Discussion.find({ hashtags: { $in: tagsArray } });
        res.json(discussions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getDiscussionsByText = async (req, res) => {
    const { text } = req.query; // Get text from query string

    try {
        // Use regex to perform a case-insensitive search in the text field
        const discussions = await Discussion.find({ text: new RegExp(text, 'i') });
        res.json(discussions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.commentOnDiscussion = async (req, res) => {
    const { text } = req.body;

    try {
        const discussion = await Discussion.findById({_id:req.params.id});
        if (!discussion) {
            return res.status(404).json({ error: 'Discussion not found' });
        }
        discussion.comments.push({text,user:req.user.id });
        await discussion.save();
        res.json(discussion);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.likeDiscussion = async (req, res) => {
    try {
        const discussion = await Discussion.findById(req.params.id);
        if (!discussion) {
            return res.status(404).json({ error: 'Discussion not found' });
        }
        if (!discussion.likes.includes(req.user.id)) {
            discussion.likes.push(req.user.id);
            await discussion.save();
        }
        res.json(discussion);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.viewDiscussion = async (req, res) => {
    try {
        const discussion = await Discussion.findById(req.params.id);
        if (!discussion) {
            return res.status(404).json({ error: 'Discussion not found' });
        }
        discussion.views++;
        await discussion.save();
        res.json(discussion);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteComment = async (req, res) => {
    try {
        const discussion = await Discussion.findById(req.params.discussionId);
        if (!discussion) {
            return res.status(404).json({ error: 'Discussion not found' });
        }

        if (discussion.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized action' });
        }
        const commentIndex = discussion.comments.findIndex(c => c._id.toString() === req.params.commentId);

        if (commentIndex !== -1) {
            discussion.comments.splice(commentIndex, 1);
            await discussion.save();
        }
        res.json(discussion);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateComment = async (req, res) => {
    const { text } = req.body;

    try {
        const discussion = await Discussion.findById(req.params.discussionId);
        if (!discussion) {
            return res.status(404).json({ error: 'Discussion not found' });
        }
        if (discussion.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized action' });
        }
        const comment = discussion.comments.find(c => c._id.toString() === req.params.commentId);

        if (comment) {
            comment.text = text;
            await discussion.save();
        }
        res.json(discussion);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.likeComment = async (req, res) => {
    try {
        const discussion = await Discussion.findById(req.params.discussionId);
        const comment = discussion.comments.find(c => c._id.toString() === req.params.commentId);
        if (!discussion) {
            return res.status(404).json({ error: 'Discussion not found' });
        }
        if (comment && !comment.likes.includes(req.user.id)) {
            comment.likes.push(req.user.id);
            await discussion.save();
        }
        res.json(discussion);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.addReplyToComment = async (req, res) => {

    const {text} = req.body
    try {
        // Find the discussion by ID
        const discussion = await Discussion.findById(req.params.discussionId);
        if (!discussion) {
            return res.status(404).json({ error: 'Discussion not found' });
        }

        // Find the comment by ID within the discussion
        const comment = discussion.comments.id(req.params.commentId);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        // Create a new reply object
        const newReply = {
            text,
            user: req.user.id // Assumes user is authenticated and user ID is available in req.user
        };

        // Add the reply to the comment's replies array
        comment.replies.push(newReply);

        // Save the updated discussion
        await discussion.save();

        res.status(201).json(comment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};