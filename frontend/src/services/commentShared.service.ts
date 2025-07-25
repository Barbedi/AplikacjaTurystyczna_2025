import httpCommon from "../http-common";
import { CommentShared } from "../assets/Data";

class CommentSharedService {
  getCommentsBySharedTrailId(sharedTrailId: number) {
    return httpCommon.get<CommentShared[]>(`/comment-shared/${sharedTrailId}`);
  }

  addComment(comment: CommentShared) {
    return httpCommon.post<CommentShared>("/comment-shared", comment);
  }

  deleteComment(commentId: number) {
    return httpCommon.delete(`/comment-shared/${commentId}`);
  }
}

export default new CommentSharedService();
