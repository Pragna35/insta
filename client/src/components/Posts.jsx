import Post from "./Post";

const Posts = () => {
    return (
        <div>
            {[1,2,3,4,5].map((post,ind) => <Post key={ind}/>)}
        </div>
    )
}
export default Posts;