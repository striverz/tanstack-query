import { useQuery, useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

const POSTS = [
  {
    id: "1",
    title: "POST-1",
  },
  {
    id: "2",
    title: "POST-2",
  },
];

const App = () => {
  const queryClient = useQueryClient();

  console.log(POSTS);

  const postQuery = useQuery({
    queryKey: ["posts"],
    queryFn: () =>
      wait(7000).then(() => {
        return [...POSTS];
      }),
  });

  const postMutation = useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) => {
      return wait(5000).then(() => {
        POSTS.push({ id, title });
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  if (postQuery.isLoading)
    return <h1 className="text-blue-500">The App is Loading...</h1>;
  if (postQuery.isError)
    return <h1 className="text-red-700">The App got an Error...</h1>;
  return (
    <div>
      <div>
        {postQuery.data?.map((post) => (
          <h2 key={post.id} className="text-blue-500">
            {post.title}
          </h2>
        ))}
      </div>
      <button
        className={
          postMutation.isPending
            ? `bg-red-500 p-2 rounded-lg m-2`
            : `bg-blue-500  p-2 rounded-lg m-2`
        }
        onClick={() => postMutation.mutate({ id: "3", title: "POST 3" })}
      >
        New Post
      </button>
    </div>
  );
};

function wait(duration: number) {
  return new Promise(function (resolve, reject) {
    setTimeout(resolve, duration);
  });
}
export default App;
