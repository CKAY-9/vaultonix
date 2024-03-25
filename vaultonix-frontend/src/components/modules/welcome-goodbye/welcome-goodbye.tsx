import style from "./auto-roles.module.scss";

const WelcomeGoodbyeModule = () => {
  return (
    <>
      <h3>Welcome/Goodbye Message</h3>
      <span>
        Say welcome or goodbye to users joining and leaving your server
      </span>
      <label>Welcome</label>
      <textarea placeholder="You can use {username} to say their name" cols={30} rows={2}></textarea>
      <label>Goodbye</label>
      <textarea placeholder="You can use {username} to say their name" cols={30} rows={2}></textarea>
    </>
  );
};

export default WelcomeGoodbyeModule;
