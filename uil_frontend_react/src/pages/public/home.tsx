import { useGetMe } from "@/data/user/current_user-profile-query";

const Home = () => {
  const { data: user } = useGetMe();

  console.log(user);

  return <div>HOMEPAGE</div>;
};

export default Home;
