import * as React from "react";
import Box from "@mui/material/Box";
import { Topbar } from "../Topbar/Topbar";
import style from "./sidebar.module.css";
import { Collapse, Divider } from "@mui/material";
import { NavLink, useNavigate } from "react-router";
import {
  BestOfferIcon,
  CollapseDownIcon,
  DashboardIcon,
  DirectoryIcon,
  HomeIcon,
  LogoutIcon,
  PatientIcon,
  SettingsIcon,
  SplashIcon,
  SubscriptionIcon,
} from "../Icons/SvgIcons";
import { HelpCenterCard } from "./HelpCenterCard";
import { MainBodyContainer } from "../Layouts/MainBodyContainer";

export function Sidebar({ children }) {
  const navigate = useNavigate();
  const menuItems = [
    { break: true, title: "break2" },
    {
      path: "/dashboard",
      icon: <DashboardIcon />,
      title: "Dashboard",
    },
    {
      path: "/doctors",
      icon: <SubscriptionIcon />,
      title: "Doctors",
    },
    {
      path: "/patients",
      icon: <PatientIcon />,
      title: "Patients",
    },

    { break: true, title: "break2" },
    {
      path: "/specialtyManagement",
      icon: <SettingsIcon />,
      title: "Services",
    },
    {
      path: "/appointments",
      icon: <DirectoryIcon />,
      title: "Appointments",
    },

    // {
    //   path: '/purchasedSubscription',
    //   icon: <SubscriptionIcon />,
    //   title: 'Purchased Subscription'
    // },

    // {
    //   path: '/manageSubscriptions',
    //   icon: <SubscriptionIcon />,
    //   title: 'Manage Subscription'
    // },
    {
      path: "/customerSupportManagement",
      icon: <HomeIcon />,
      title: "Customer Support",
    },
    {
      icon: <HomeIcon />,
      title: "Leads",
      children: [
        {
          path: "/leadsManagement",
          icon: <SplashIcon />,
          title: "Leads",
        },
        {
          path: "/leadsPipeline",
          icon: <SplashIcon />,
          title: "Pipeline",
        },
      ],
    },
    {
      path: "/products",
      icon: <HomeIcon />,
      title: "Products",
    },
        {
          path: '/OrderHistory',
          icon: <HomeIcon />,
          title: 'Order History'
        },
    {
      icon: <HomeIcon />,
      title: "App Design",
      children: [
        {
          path: "/theme",
          icon: <HomeIcon />,
          title: "Themes",
        },
        {
          path: "/splashScreen",
          icon: <SplashIcon />,
          title: "Splash Screen ",
        },
        {
          path: "/onboardingManagement",
          icon: <DirectoryIcon />,
          title: "Onboarding Screen ",
        },
        {
          path: "/BestOffer",
          icon: <BestOfferIcon />,
          title: "Best Offer",
        },

        {
          path: "/safeAndSurgery",
          icon: <HomeIcon />,
          title: "Safe And Surgery",
        },
        {
          path: "/teamManagement",
          icon: <HomeIcon />,
          title: "Team Management",
        },
        {
          path: "/newsManagement",
          icon: <DirectoryIcon />,
          title: "News Management",
        },
      ],
    },
    // {
    //   icon: <HomeIcon />,
    //   title: 'Service And Packages',
    //   children:[
    //     {
    //       icon:<HomeIcon/>,
    //       path: '/services',
    //       title:"Services"
    //     },
    //     {
    //       icon:<HomeIcon/>,
    //       path: '/packages',
    //       title:"Packages"
    //     }
    //   ]
    // },
    {
      path: "/setup",
      icon: <SubscriptionIcon />,
      title: "Setup",
    },
       {
      path: "/faq",
      icon: <HomeIcon />,
      title: "FAQ",
    },

    {
      path: "/",
      icon: <LogoutIcon />,
      title: "Log Out",
      onClick: () => {
        localStorage.clear();
        navigate("/");
      },
    },
  ];

  return (
    <Box className={style.sidebar_main_con}>
      <Topbar />
      <Box className={style.main_body_con}>
        <div className={style.sidebar_con}>
          <div
            className={`${style.sidebar_shadow_con} flex flex-col justify-between`}
          >
            <div>
              {menuItems.map((item, index) => {
                return (
                  <RenderMenuItems
                    key={`${item.title}-${index}`}
                    items={item}
                  />
                );
              })}
            </div>
            {/* <div>
              <HelpCenterCard />
            </div> */}
          </div>
        </div>
        <div className={style.sidebar_children_con}>
          <MainBodyContainer>{children}</MainBodyContainer>
        </div>
      </Box>
    </Box>
  );
}

function RenderMenuItems({ items }) {
  const [expand, setExpand] = React.useState(false);
  if (!!items?.children?.length) {
    return (
      <Box>
        <div
          className={`${style.navlink_tag} pointer`}
          onClick={() => setExpand(!expand)}
        >
          <div className="flex justify-between items-center w-[100%]">
            <div className="flex gap-[10px]">
              <div>{items.icon}</div>
              <div>{items.title}</div>
            </div>
            <div
              className={`${expand && style.toggleClass} ${
                style.dropdown_arrow_icon
              }`}
            >
              <CollapseDownIcon />
            </div>
          </div>
        </div>

        <Collapse in={expand} className="ms-5">
          {items.children.map((e) => (
            <RenderMenuItems key={e.title} items={e} />
          ))}
        </Collapse>
      </Box>
    );
  } else {
    return items.break ? (
      <Divider key={items.title} sx={{ backgroundColor: "#E5E7FB" }} />
    ) : (
      <NavItem
        to={items.path}
        title={items.title}
        onClick={items.onClick}
        icon={items.icon}
      />
    );
  }
}

function NavItem({ to, title, icon, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick && onClick}
      className={({ isActive }) =>
        [isActive ? style.active_navlink : "", style.navlink_tag].join(" ")
      }
    >
      <div>{icon}</div>
      <div>{title}</div>
    </NavLink>
  );
}
