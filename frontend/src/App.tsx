import { Button } from "./components/ui/button";

const App = () => {
  return (
    <>
      <div className="text-center m-8 text-green-600 text-5xl">Hello, do you need help?</div>
      <div className="flex min-h-svh flex-col items-center justify-center">
         <Button>Click me</Button>
      </div>
    </>
    
  );
};

export default App;
