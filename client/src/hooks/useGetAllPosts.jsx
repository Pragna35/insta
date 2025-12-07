const { useEffect } = require("react");

const useGetAllPosts = () => {
  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/v1/post/allposts",
          {
            // headers: {
            //   "Content-Type": "application/json",
            // },
            withCredentials: true,
          }
        );
      } catch (error) {
        console.log(error);
      }
    };
  }, []);
};
