const SidebarLink = ({ Icon, label }) => (
    <div className="flex items-center space-x-2 text-gray-700 hover:bg-gray-200 px-2 py-2 rounded-md cursor-pointer">
      {/* Icon for the link */}
      <Icon className="h-5 w-5 text-gray-600" />
      {/* Label for the link */}
      <span>{label}</span>
    </div>
  );
  

  export default SidebarLink