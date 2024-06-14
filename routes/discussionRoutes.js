const express = require('express');
const upload = require('../middleware/multer');
const {
    createDiscussion, updateDiscussion, deleteDiscussion, listDiscussions, getDiscussionsByTags,getDiscussionsByText,
    commentOnDiscussion, likeDiscussion, viewDiscussion, deleteComment, updateComment, likeComment,addReplyToComment
} = require('../controllers/discussionController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect,upload.single('image'), createDiscussion);

router.put('/:id', protect,upload.single('image'), updateDiscussion);
router.delete('/:id', protect, deleteDiscussion);
router.get('/', listDiscussions);
router.get('/tags', protect, getDiscussionsByTags);

router.get('/search', protect,getDiscussionsByText);


router.post('/:id/comments', protect, commentOnDiscussion);
router.post('/:id/likes', protect, likeDiscussion);
router.post('/:id/views', protect, viewDiscussion);

router.delete('/:discussionId/comments/:commentId', protect, deleteComment);
router.put('/:discussionId/comments/:commentId', protect, updateComment);
router.post('/:discussionId/comments/:commentId/likes', protect, likeComment);

router.post('/:discussionId/comments/:commentId/replies', protect, addReplyToComment);

module.exports = router;
