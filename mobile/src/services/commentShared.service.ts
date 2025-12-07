import { api } from "../config/api";
import { CommentShared } from "../types";

class CommentSharedService {
  getCommentsBySharedTrailId(sharedTrailId: number) {
    return api.get<CommentShared[]>(`/comment-shared/${sharedTrailId}`);
  }

  addComment(comment: CommentShared) {
    return api.post<CommentShared>("/comment-shared", comment);
  }

  deleteComment(commentId: number) {
    return api.delete(`/comment-shared/${commentId}`);
  }
}

export default new CommentSharedService();
