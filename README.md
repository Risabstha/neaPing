# neaPing

neaPing is a network monitoring tool for managing, monitoring, and visualizing the status of networked devices (by IP) across multiple provinces or regions. It provides a modern web dashboard for administrators to manage IP addresses, monitor network status, and visualize connectivity via heatmaps.



## Client (Frontend)

The `Client` folder contains a React-based web application for interacting with the network monitoring system.

### Key Features

- **Authentication:** Secure login and registration, with session management and route protection.
- **Dashboard:** Visual overview of network/server status, including online/offline/issue stats.
- **IP Management:** CRUD (Create, Read, Update, Delete) operations for IP addresses, including assignment of province/region and device names.
- **Heatmap Visualization:** Visualize the connectivity/status of multiple devices/IPs across different regions.
- **Responsive Navigation:** Sidebar navigation for easy access to dashboard, IP management, and heatmap.


### Key Features

- **User Authentication:** JWT-based auth, role management for different user types (e.g., MD, PA).
- **IP Management API:** Endpoints for adding, editing, deleting, and listing IPs.
- **Secure Access:** Middleware for protecting API endpoints and verifying user sessions.
- **Extensible:** Designed for integration with real network status checks or external monitoring systems.


## Features

- **Role-Based Access:** Only authorized users can manage IPs or view sensitive data.
- **Network Heatmap:** Quickly visualize network health by region.
- **Dashboard Analytics:** Get a snapshot of network/server/device status.
- **Province/Region Filtering:** Filter IPs/devices by province for large-scale monitoring.





*Project maintained by [Risabstha](https://github.com/Risabstha).*
