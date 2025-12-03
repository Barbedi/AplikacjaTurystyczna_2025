import { View, Text, ScrollView, Image, Pressable, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";

import communitytrailsService from "@/src/services/communitytrails.service";
import likeTrailService from "@/src/services/LikeTrail.service";
import trailsService from "@/src/services/trails.service";
import filesService from "@/src/services/file.service";

import CommentSection from "@/src/components/shared/CommentSection";
import { timeAgo } from "@/src/utils/format";
import { FontAwesome6 } from "@expo/vector-icons";

export default function SharedTrailDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); 

  const [shared, setShared] = useState<any>(null);
  const [trail, setTrail] = useState<any>(null);
  const [likes, setLikes] = useState(0);
  const [likedByUser, setLikedByUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAll = async () => {
      try {
        const sharedIdNum = Number(id);

        const [postRes, likeRes] = await Promise.all([
          communitytrailsService.getCommunityTrailDetails(sharedIdNum),
          likeTrailService.getLikesInfo(sharedIdNum),
        ]);

        setShared(postRes.data);
        setLikes(likeRes.data.totalLikes);
        setLikedByUser(likeRes.data.likedByUser);

        const trailRes = await trailsService.getTrailById(postRes.data.trail_id);
        setTrail(trailRes.data);
      } catch (err) {
        console.error("Error loading shared:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, [id]);

  const handleLike = async () => {
    if (!shared) return;
    try {
      const res = await likeTrailService.likeTrail(shared.shared_id);
      if (res.status === 201) {
        setLikedByUser(true);
        setLikes((p) => p + 1);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleUnlike = async () => {
    if (!shared) return;
    try {
      const res = await likeTrailService.unlikeTrail(shared.shared_id);
      if (res.status === 200) {
        setLikedByUser(false);
        setLikes((p) => p - 1);
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#050c28]">
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (!shared) {
    return (
      <View className="flex-1 justify-center items-center bg-[#050c28]">
        <Text className="text-white">Nie znaleziono wątku.</Text>
      </View>
    );
  }



  return (
    <LinearGradient colors={["#5996eb", "#050c28"]} className="flex-1">
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        
        <View className="bg-white/10 rounded-2xl p-5 border border-white/20 mb-4">
          <View className="flex-row items-center gap-3">
            {shared.user_profile_image ? (
              <Image
                source={{ uri: filesService.getImgUrl(shared.user_profile_image) }}
                className="w-12 h-12 rounded-full bg-white/20"
              />
            ) : (
              <View className="w-12 h-12 rounded-full bg-white/20 justify-center items-center">
                <Text className="text-white font-bold text-lg">
                  {shared.user_name?.charAt(0) || "?"}
                </Text>
              </View>
            )}

            <View className="flex-1">
              <Text className="text-white font-semibold text-lg">{shared.user_name}</Text>
              <Text className="text-white/70">{timeAgo(shared.created_at)}</Text>
            </View>

            <Pressable
              onPress={likedByUser ? handleUnlike : handleLike}
              className="flex-row items-center gap-2"
            >
              <FontAwesome6
                name="thumbs-up"
                size={22}
                color={likedByUser ? "#ef4444" : "#ffffff"}
                solid={likedByUser}
              />
              <Text className="text-white text-lg">{likes}</Text>
            </Pressable>
          </View>
        </View>

        <View className="bg-white/10 rounded-2xl p-5 border border-white/20 mb-4">
          <Text className="text-white/80 font-bold mb-2 text-center">
            Opis trasy
          </Text>

          <Text className="text-white text-xl">
            {shared.shared_description || "Brak opisu"}
          </Text>
        </View>
        {trail && (
          <View className="bg-white/10 rounded-2xl p-5 border border-white/20 mb-4">
            <Text className="text-white/80 mb-3 font-semibold">Statystyki trasy</Text>

            <View className="flex-row justify-between flex-wrap gap-3">

              <View className="bg-white/10 px-4 py-3 rounded-xl w-[48%]">
                <Text className="text-white/50 text-xs">Długość</Text>
                <Text className="text-white font-bold text-lg">{trail.length_km} km</Text>
              </View>

              <View className="bg-white/10 px-4 py-3 rounded-xl w-[48%]">
                <Text className="text-white/50 text-xs">Czas przejścia</Text>
                <Text className="text-white font-bold text-lg">
                  {Math.floor(trail.duration_minutes / 60)} h {trail.duration_minutes % 60} min
                </Text>
              </View>

              <View className="bg-white/10 px-4 py-3 rounded-xl w-[48%]">
                <Text className="text-white/50 text-xs">Przewyższenie</Text>
                <Text className="text-white font-bold text-lg">{trail.elevation_gain} m</Text>
              </View>

              <View className="bg-white/10 px-4 py-3 rounded-xl w-[48%]">
                <Text className="text-white/50 text-xs">Trudność</Text>
                <Text className="text-white font-bold text-lg">{trail.difficulty||"Brak informacji"}</Text>
              </View>
            </View>

            <Pressable
              onPress={() => router.push(`/(screen)/trail/${trail.id}`)}
              className="mt-5 bg-white/20 px-5 py-3 rounded-xl active:bg-white/30"
            >
              <Text className="text-white font-semibold text-center">Zobacz trasę</Text>
            </Pressable>
          </View>
        )}
        <CommentSection sharedTrailId={shared.shared_id} />
      </ScrollView>
    </LinearGradient>
  );
}
