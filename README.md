🎨 Canvas-69
============

A collaborative canvas application built using **Next.js** and **TypeScript**.This project aims to provide a shared drawing space where multiple users can interact in real time.

🚀 Tech Stack
-------------

*   Next.js
    
*   TypeScript
    
*   WebSockets
    
*   Zustand (State Management)
    
*   Node.js
    

📂 Project Structure
--------------------

canvas-69/│── app/ → Main Next.js application│── components/ → Reusable UI components│── lib/ → Utility and helper functions│── public/ → Static assets│── server.ts → WebSocket server (⚠ currently not working)│── package.json → Project dependencies and scripts│── tsconfig.json → TypeScript configuration

⚠️ Important Notice
-------------------

The server.ts file is currently **not working Please use the https://github.com/Varun789-mx/wsbackend.git**.

Real-time WebSocket functionality will not operate correctly until this file is fixed.If you plan to use or extend this project, backend functionality requires debugging and improvement.

🛠 Installation
---------------

Clone the repository:

git clone [https://github.com/Varun789-mx/canvas-69.git](https://github.com/Varun789-mx/canvas-69.git?utm_source=chatgpt.com)

cd canvas-69

Install dependencies:

npm install

Run the development server:

npm run dev

📌 Available Scripts
--------------------

*   npm run dev → Start development server
    
*   npm run build → Build project for production
    
*   npm run start → Start production server
    
*   npm run lint → Run ESLint
    

🎯 Current Status
-----------------

*   Frontend setup completed
    
*   WebSocket backend incomplete / not functioning
    
*   No automated tests implemented
    

📖 Future Improvements
----------------------

*   Fix and properly implement server.ts
    
*   Add authentication system
    
*   Improve error handling
    
*   Add unit and integration tests
    
*   Enhance documentation
    

🤝 Contributing
---------------

Contributions are welcome.Please open an issue before submitting a pull request.

📜 License
----------

This project is open source and available under the MIT License.
