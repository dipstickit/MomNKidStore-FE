// import React, { useEffect, useState } from "react";
// import "./UseFull.scss";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import { MainAPI } from "../../../API";
// import { convertSQLDate } from "../../../../utils/Format";
// import { IoIosArrowDropright } from "react-icons/io";

// export default function UseFull() {
//   const [blogs, setBlogs] = useState([]);
//   useEffect(() => {
//     axios
//       .get(`http://localhost:5000/posts`)
//       .then((res) => {
//         setBlogs(res.data);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }, []);

//   return (
//     <div style={{ marginTop: "2%" }}>
//       <div className="use_container">
//         <div className="d-flex justify-content-between align-center">
//           <h2 style={{ marginBottom: "20px" }}>Thông tin bổ ích</h2>
//           <span>
//             <Link
//               to={"/blogs"}
//               style={{
//                 textDecoration: "none",
//                 color: "#FF3E9F",
//               }}
//             >
//               Xem tất cả <IoIosArrowDropright />
//             </Link>
//           </span>
//         </div>
//         <div className="usefull_container ">
//           {blogs.map((usefull) => (
//             <Link
//               to={`/blogs/post/${usefull.post_id}`}
//               className="usefull_detail"
//               key={usefull.post_id}
//             >
//               <div className="usefull-img-container">
//                 <img src={usefull.image_url} alt={usefull.title} />
//               </div>
//               <p
//                 className="fw-bold mt-2"
//                 style={{ lineHeight: "17px", fontSize: "14px" }}
//               >
//                 {usefull.title}
//               </p>
//               <p className="mt-auto d-flex justify-content-between">
//                 <span> {convertSQLDate(usefull.post_date)}</span>
//                 <span className="fs-5">
//                   <IoIosArrowDropright />
//                 </span>
//               </p>
//             </Link>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import "./UseFull.scss";
import { Link } from "react-router-dom";
import axios from "axios";
import { MainAPI } from "../../../API";
import { IoIosArrowDropright } from "react-icons/io";

export default function UseFull() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    axios
      .get(`${MainAPI}/Blog/GetAllBlog`)
      .then((res) => {
        setBlogs(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div style={{ marginTop: "2%" }}>
      <div className="use_container">
        <div className="d-flex justify-content-between align-center">
          <h2 style={{ marginBottom: "20px" }}>Thông tin bổ ích</h2>
          <span>
            <Link
              to={"/blogs"}
              style={{
                textDecoration: "none",
                color: "#FF3E9F",
              }}
            >
              Xem tất cả <IoIosArrowDropright />
            </Link>
          </span>
        </div>
        <div className="usefull_container ">
          {blogs.map((usefull) => (
            <Link
              to={`/blogs/post/${usefull.blogId}`}
              className="usefull_detail"
              key={usefull.blogId}
            >
              <div className="usefull-img-container">
                <img
                  src={usefull.blogImage || "https://via.placeholder.com/150"}
                  alt={usefull.blogTitle}
                />
              </div>
              <p
                className="fw-bold mt-2"
                style={{ lineHeight: "17px", fontSize: "14px" }}
              >
                {usefull.blogTitle}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}