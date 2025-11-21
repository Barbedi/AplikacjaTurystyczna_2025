import { View, Text, ScrollView, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useState, useEffect } from "react";
import useGetUsers from "@/src/hooks/useGetUser";
import reviewService from "@/src/services/review.service";
import { getAuthenticatedUser } from "@/src/config/api";
import { Review } from "../../src/types";
import ConfirmDeleteModal from "../../src/components/ConfirmDeleteModal";

const ReviewsScreen = () => {
  const { getUserByEmail, usersData, loading: userLoading } = useGetUsers();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const authData = await getAuthenticatedUser();
        if (authData?.user?.email) {
          await getUserByEmail(authData.user.email);
        }
      } catch (error) {
        console.error("Błąd ładowania użytkownika:", error);
        setError("Nie udało się załadować danych użytkownika.");
      }
    };

    loadUser();
  }, [getUserByEmail]);

  const currentUser = usersData?.[0]?.[0];

  useEffect(() => {
    const loadStats = async () => {
      if (!currentUser?.id) return;
      setLoading(true);
      try {
        const response = await reviewService.getReviewByUserId(currentUser.id);
        const reviewList = response.data.data;

        setReviews(reviewList);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.id) loadStats();
  }, [currentUser?.id]);
  const handleDeleteReview = async (reviewId: number) => {
    try {
      await reviewService.deleteReview(reviewId);
      setReviews(reviews.filter((review) => review.id !== reviewId));
      setModalVisible(false);
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };
  return (
    <LinearGradient colors={["#5996eb", "#050c28"]} className="flex-1">
      <SafeAreaView edges={["bottom", "left", "right"]} className="flex-1">
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 10,
            paddingBottom: 20,
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-col gap-4">
            {loading && (
              <Text className="text-white text-center">
                Ładowanie twoich recenzji...
              </Text>
            )}

            {error && (
              <View className="bg-red-500/20 p-4 rounded-xl">
                <Text className="text-red-400 text-center">{error}</Text>
              </View>
            )}
            {!loading && !error && reviews && reviews.length > 0 ? (
              reviews.map((review) => (
                <View
                  key={review.id}
                  className="w-full bg-white/10 rounded-2xl p-5 border-l-4 border-yellow-500"
                >
                  <View className="flex-row items-center gap-3 mb-4">
                    <View className="bg-yellow-500/20 w-12 h-12 rounded-full items-center justify-center">
                      <FontAwesome6
                        name="comment"
                        size={24}
                        color="#eab308"
                        solid
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-xl font-bold text-white">
                        {review.trail_name}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row items-center justify-center mb-4  py-2 rounded-xl">
                    <Text className="text-white/70 text-sm">Ocena: </Text>
                    <Text className="text-white text-sm font-bold">
                      {review.rating}
                    </Text>
                    <View className="flex-row ml-2 gap-1">
                      {[...Array(5)].map((_, i) => (
                        <FontAwesome6
                          key={i}
                          name="star"
                          size={14}
                          solid={i < (review.rating ?? 0)}
                          color={
                            i < (review.rating ?? 0) ? "#facc15" : "#ffffff4d"
                          }
                        />
                      ))}
                    </View>
                  </View>
                  <View className="mb-4">
                    <View className="flex-row items-center gap-2 mb-2">
                      <FontAwesome6
                        name="message"
                        size={14}
                        color="#ffffff70"
                      />
                      <Text className="text-white/70 text-sm font-semibold">
                        Komentarz:
                      </Text>
                    </View>
                    <View className="bg-white/10 p-4 rounded-xl">
                      <Text className="text-white/90 text-sm leading-5">
                        {review.comment}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row justify-between items-center pt-3 border-t border-white/10">
                    <View className="flex-row items-center gap-2">
                      <FontAwesome6
                        name="calendar"
                        size={12}
                        color="#ffffff70"
                      />
                      <Text className="text-white/70 text-xs">
                        {new Date(
                          review.created_at || "Brak daty",
                        ).toLocaleDateString("pl-PL")}
                      </Text>
                    </View>
                    <Pressable
                      onPress={() => {
                        if (review.id) {
                          setSelectedReviewId(review.id);
                          setModalVisible(true);
                        }
                      }}
                    >
                      <View className="bg-red-500/20 w-10 h-10 rounded-full items-center justify-center">
                        <FontAwesome6 name="trash" size={16} color="#ef4444" />
                      </View>
                    </Pressable>
                  </View>
                </View>
              ))
            ) : !loading && !error ? (
              <View className="flex-1 items-center justify-center py-10">
                <FontAwesome6 name="comment" size={48} color="#ffffff40" />
                <Text className="text-white/60 text-center mt-4 text-lg">
                  Nie masz jeszcze żadnych recenzji.
                </Text>
                <Text className="text-white/40 text-center mt-2 text-sm">
                  Rozpocznij swoją przygodę górską!
                </Text>
              </View>
            ) : null}
          </View>
          <ConfirmDeleteModal
            visible={modalVisible}
            title="Usuń recenzję?"
            message="Czy na pewno chcesz usunąć tę recenzję? Tej operacji nie można cofnąć."
            onCancel={() => setModalVisible(false)}
            onConfirm={() => {
              if (selectedReviewId !== null) {
                handleDeleteReview(selectedReviewId);
              }
            }}
          />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default ReviewsScreen;
