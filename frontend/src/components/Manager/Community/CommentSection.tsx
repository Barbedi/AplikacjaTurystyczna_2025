import commentSharedService from "../../../services/commentShared.service";
import { CommentShared } from "../../../assets/Data";
import { useEffect, useState, useContext } from "react";
import useGetUsers from "../../../hooks/user/useGetUser";
import AuthContext from "../../../store/auth-context";
import filesService from "../../../services/files.service";
import { timeAgo } from "../../../utils/format";

interface CommentSectionProps {
  sharedTrailId: number;
}

const CommentSection = ({ sharedTrailId }: CommentSectionProps) => {
  const { getUserByEmail, usersData } = useGetUsers();
  const [visibleCount, setVisibleCount] = useState(2);
  const { user } = useContext(AuthContext);
  const [comments, setComments] = useState<CommentShared[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  useEffect(() => {
    if (user?.email) {
      getUserByEmail(user.email);
    }
  }, [user?.email, getUserByEmail]);
  const currentUser = usersData?.[0][0];
  const currentUserAvatarUrl = currentUser?.profile_image || "";

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response =
          await commentSharedService.getCommentsBySharedTrailId(sharedTrailId);
        setComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchComments();
  }, [sharedTrailId]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !currentUser?.id) return;

    const comment: CommentShared = {
      shared_trail_id: sharedTrailId,
      user_id: currentUser.id,
      content: newComment,
    };

    try {
      const response = await commentSharedService.addComment(comment);
      const newCommentWithUser = response.data;
      setComments((prev) => [newCommentWithUser, ...prev]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleShowMore = () => {
  setVisibleCount((prev) => prev + 2); 
};
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 mt-6 mb-6 overflow-hidden">
      <div className="p-4 border-b border-white/10">
        <h3 className="text-white font-medium">
          Komentarze ({comments.length})
        </h3>
      </div>
      <div className="p-4 border-b border-white/10">
        <div className="flex gap-3">
          <img
            className="rounded-full h-10 w-10 object-cover bg-amber-400/50 ring-1 ring-white/30"
            src={filesService.getImgUrl(currentUserAvatarUrl)}
            alt="Your Avatar"
          />
          <div className="flex-grow">
            <textarea
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white resize-none focus:outline-none focus:ring-1 focus:ring-amber-500/50"
              placeholder="Dodaj komentarz..."
              rows={2}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            ></textarea>
            <div className="flex justify-end mt-2">
              <button
                onClick={handleAddComment}
                className="px-4 py-1.5 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-all text-sm"
              >
                Opublikuj
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="divide-y divide-white/10">
        {comments.length > 0 ? (
          comments.slice(0, visibleCount).map((comment) => (
            <div key={comment.id} className="flex gap-3 p-4">
              <img
                className="rounded-full h-10 w-10 object-cover bg-blue-400/50 ring-1 ring-white/30"
                src={filesService.getImgUrl(comment.user?.profile_image || "")}
              />
              <div className="flex-grow">
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium">
                    {comment.user?.name}
                  </span>
                  <span className="text-gray-400 text-xs">
                    {timeAgo(comment.created_at as string)}
                  </span>
                </div>
                <p className="text-gray-300 mt-1">{comment.content}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-gray-400 text-center">Brak komentarzy</div>
        )}
        {comments.length > visibleCount && (
        <div className="p-4 flex justify-center">
            <button
            onClick={handleShowMore}
            className="px-4 py-1.5 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-all text-sm"
            >
            Pokaż więcej komentarzy
            </button>
        </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
