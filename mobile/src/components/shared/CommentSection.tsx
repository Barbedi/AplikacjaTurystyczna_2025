import { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, Image, ScrollView } from "react-native";
import commentSharedService from "@/src/services/commentShared.service";
import useGetUsers from "@/src/hooks/useGetUser";
import { getAuthenticatedUser } from "@/src/config/api";
import filesService from "@/src/services/file.service";
import { timeAgo } from "@/src/utils/format";

interface CommentSectionProps {
  sharedTrailId: number;
}

export default function CommentSection({ sharedTrailId }: CommentSectionProps) {
  const { getUserByEmail, usersData } = useGetUsers();
  const [comments, setComments] = useState<any[]>([]);
  const [visibleCount, setVisibleCount] = useState(2);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      const auth = await getAuthenticatedUser();
      if (auth?.user?.email) {
        await getUserByEmail(auth.user.email);
      }
    };
    loadUser();
  }, []);

  const currentUser = usersData?.[0]?.[0];
  const currentAvatar = currentUser?.profile_image
    ? filesService.getImgUrl(currentUser.profile_image)
    : "";

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await commentSharedService.getCommentsBySharedTrailId(sharedTrailId);
        setComments(res.data);
      } catch (err: any) {
        if (err.response && err.response.status === 404) {
          setComments([]);
        } else {
          console.log("Error loading comments:", err);
        }
      }
    };
    fetchComments();
  }, [sharedTrailId]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !currentUser?.id) return;

    try {
      const payload = {
        shared_trail_id: sharedTrailId,
        user_id: currentUser.id,
        content: newComment,
      };

      const res = await commentSharedService.addComment(payload);

      setComments((prev) => [res.data, ...prev]);
      setNewComment("");
    } catch (err) {
      console.log("Error posting comment:", err);
    }
  };

  return (
    <View className="bg-white/10 p-4 mt-4 rounded-2xl border border-white/20">
      <Text className="text-white text-lg font-semibold mb-3">
        Komentarze ({comments.length})
      </Text>

      <View className="flex-row items-start gap-3 mb-4 border-b border-white/20">
        {currentAvatar ? (
          <Image
            source={{ uri: currentAvatar }}
            className="w-10 h-10 rounded-full bg-white/20"
          />
        ) : (
          <View className="w-10 h-10 rounded-full bg-white/20 justify-center items-center">
             <Text className="text-white text-xs">?</Text>
          </View>
        )}

        <View className="flex-1">
          <TextInput
            value={newComment}
            onChangeText={setNewComment}
            placeholder="Dodaj komentarz..."
            placeholderTextColor="#ffffff70"
            className="bg-white/10 text-white p-3 rounded-xl border border-white/20"
            multiline
          />

          <Pressable
            onPress={handleAddComment}
            className="mt-2 self-end bg-amber-500 px-4 py-2 rounded-xl mb-2"
          >
            <Text className="text-white font-semibold">Opublikuj</Text>
          </Pressable>
        </View>
      </View>

      
      {comments.length === 0 ? (
  <Text className="text-white/40 text-center mt-3">Brak komentarzy</Text>
) : (
  <View>
    {comments.slice(0, visibleCount).map((c, index) => (
      <View key={c.id}>
        
        {/* KRESKA — TYLKO jeśli to nie pierwszy komentarz */}
        {index !== 0 && (
          <View
            style={{
              height: 1,
              backgroundColor: "rgba(255,255,255,0.15)",
              marginVertical: 10,
            }}
          />
        )}

        {/* TREŚĆ KOMENTARZA */}
        <View className="flex-row gap-3 ">
          {c.user?.profile_image ? (
            <Image
              source={{ uri: filesService.getImgUrl(c.user.profile_image) }}
              className="w-10 h-10 rounded-full bg-white/20"
            />
          ) : (
             <View className="w-10 h-10 rounded-full bg-white/20 justify-center items-center">
                <Text className="text-white text-xs">{c.user?.name?.charAt(0) || "?"}</Text>
             </View>
          )}

          <View className="flex-1">
            <View className="flex-row items-center gap-2">
              <Text className="text-white font-semibold">{c.user?.name}</Text>
              <Text className="text-white/40 text-xs">
                {timeAgo(c.created_at as string)}
              </Text>
            </View>

            <Text className="text-white/70 mt-1">{c.content}</Text>
          </View>
        </View>
      </View>
    ))}
  </View>
)}


      {comments.length > visibleCount && (
        <Pressable
          onPress={() => setVisibleCount((prev) => prev + 2)}
          className="py-2 mt-2 bg-white/10 rounded-xl items-center"
        >
          <Text className="text-white">Pokaż więcej komentarzy</Text>
        </Pressable>
      )}
    </View>
  );
}
