
const NavbarDashboard = ({ userImage }) => {
  return (
    <div className="h-16 bg-white flex justify-end items-center px-6 shadow">
      <img
        src={userImage || '/images/default-user.png'}
        alt="User"
        className="h-10 w-10 rounded-full cursor-pointer"
      />
    </div>
  );
};

export default NavbarDashboard;
