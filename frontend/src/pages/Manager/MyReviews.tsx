import Reviews from "../../components/Manager/Reviews";

const MyReviews = () => {
  return (
    <div className="flex flex-col text-center mx-6 gap-2 w-full justify-center items-center my-4">
      <h1 className="text-3xl font-semibold text-white ">Moje opinie</h1>
      <Reviews />
      <Reviews />
    </div>
  );
};
export default MyReviews;
