import React from "react";

// PUBLIC_INTERFACE
function Sidebar() {
  return (
    <aside className="sidebar">
      {/* Future navigation items can go here. Keeping simple/minimalist. */}
      <nav>
        <ul>
          <li><span>All Notes</span></li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
