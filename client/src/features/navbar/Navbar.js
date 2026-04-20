import { Fragment, useState } from "react";
import { Menu, Transition, Dialog } from "@headlessui/react";
import { 
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  ClipboardDocumentListIcon,
  PencilSquareIcon,
  ShoppingCartIcon,
  Squares2X2Icon,
  TruckIcon,
  UserCircleIcon, 
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectItems } from "../cart/cartSlice";
import { selectLoggedInUser } from "../auth/authSlice";
import { selectUserInfo } from "../user/userSlice";

const navigation = [
  {
    name: "Products",
    link: "/",
    public: true,
    icon: Squares2X2Icon,
    match: (pathname) =>
      pathname === "/" || pathname.startsWith("/product-detail"),
  },
  {
    name: "Add/Edit Products",
    link: "/admin",
    admin: true,
    icon: PencilSquareIcon,
    match: (pathname) =>
      pathname === "/admin" ||
      pathname.startsWith("/admin/product-detail") ||
      pathname.startsWith("/admin/product-form"),
  },
  {
    name: "Orders",
    link: "/admin/orders",
    admin: true,
    icon: ClipboardDocumentListIcon,
    match: (pathname) => pathname.startsWith("/admin/orders"),
  },
];

// ✅ dynamic user navigation (hide My Orders for admin)
const getUserNavigation = (isAdmin) => [
  { name: "My Profile", link: "/profile", icon: UserCircleIcon },
  ...(!isAdmin
    ? [{ name: "My Orders", link: "/my-orders", icon: TruckIcon }]
    : []),
  { name: "Sign out", link: "/logout", icon: ArrowRightOnRectangleIcon },
];
 

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function NavBar({ children }) {
  const items = useSelector(selectItems);
  const user = useSelector(selectLoggedInUser);
  const userInfo = useSelector(selectUserInfo);
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ✅ Safe admin check
  const isAdmin =
    user && userInfo && String(userInfo.role).toLowerCase() === "admin";

  // ✅ Hide cart for admin
  const showCart = user && !isAdmin;

  const visibleNavigation = navigation.filter(
    (item) => item.public || (item.admin && isAdmin),
  );

  const userNavigation = getUserNavigation(isAdmin);

  const displayName =
    userInfo?.name || userInfo?.email?.split("@")[0] || "Account";
  const avatarText = displayName.charAt(0).toUpperCase();
  const cartLink = user ? "/cart" : "/login";
  const cartCount = items.length;

  const isCurrentLink = (item) =>
    item.match
      ? item.match(location.pathname)
      : location.pathname === item.link;

  return (
    <div className="min-h-full bg-white text-black">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* LEFT */}
          <div className="flex items-center gap-3">
            {/* ✅ Hamburger ONLY for admin */}
            {isAdmin && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
            )}

            <Link to="/" className="flex items-center gap-2">
              <div className="h-9 w-9 bg-black text-white flex items-center justify-center rounded-lg font-bold">
                BT
              </div>
              <span className="font-semibold text-2xl sm:block">
                Bittu Telecom
              </span>
            </Link>
          </div>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex gap-6">
            {visibleNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.link}
                className={classNames(
                  isCurrentLink(item)
                    ? "text-black font-semibold"
                    : "text-gray-500 hover:text-black",
                  "text-sm transition",
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* RIGHT */}
          <div className="flex items-center gap-4">
            {/* ✅ Cart hidden for admin */}
            {showCart && (
              <Link
                to={cartLink}
                className="relative p-2 rounded-lg hover:bg-gray-100"
              >
                <ShoppingCartIcon className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-xs px-1 rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* USER MENU */}
            {user ? (
              <Menu as="div" className="relative">
                <Menu.Button className="h-9 w-9 bg-black text-white rounded-full flex items-center justify-center font-bold">
                  {avatarText}
                </Menu.Button>

                <Transition as={Fragment}>
                  <Menu.Items className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-md">
                    {userNavigation.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Menu.Item key={item.name}>
                          {({ active }) => (
                            <Link
                              to={item.link}
                              className={`flex items-center gap-2 px-4 py-2 text-sm ${
                                active ? "bg-gray-100" : ""
                              }`}
                            >
                              <Icon className="h-4 w-4" />
                              {item.name}
                            </Link>
                          )}
                        </Menu.Item>
                      );
                    })}
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="flex items-center text-xs text-gray-600 sm:text-sm"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="rounded-lg bg-black px-2.5 py-1.5 text-xs text-white sm:px-3 sm:text-sm"
                >
                  Signup
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ✅ ADMIN SIDEBAR ONLY */}
      <Dialog
        open={Boolean(isAdmin && sidebarOpen)}
        onClose={setSidebarOpen}
        className="relative z-50 lg:hidden"
      >
        <div className="fixed inset-0 bg-black/40" />

        <Dialog.Panel className="fixed inset-y-0 left-0 w-72 bg-white p-5 shadow-xl overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <span className="font-bold text-lg">Admin Menu</span>
            <button onClick={() => setSidebarOpen(false)}>
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-2">
            {visibleNavigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.link}
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100"
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </Dialog.Panel>
      </Dialog>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto p-4">{children}</main>
    </div>
  );
}
