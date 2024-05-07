import { Outlet, useLoaderData } from "react-router-dom";

export const Home = () => {
  const foodList = useLoaderData();

  if (!foodList) {
    return <p>No Food items found</p>;
  }

  return (
    <>
      {(foodList as Food[]).map((food: Food) => {
        return (
          <div
            key={food.id}
            style={{
              border: "1px solid red",
              padding: "4px",
              marginBottom: 5,
              borderRadius: 5,
            }}
          >
            <p>{food.attributes.name}</p>
            <p>{food.attributes.category}</p>
            <p>{food.attributes.recipe}</p>
          </div>
        );
      })}

      <Outlet />
    </>
  );
};
