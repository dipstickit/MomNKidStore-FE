// import React, { useEffect, useState } from "react";
// import "./Blog.scss";
// import HeaderPage from "../../utils/Header/Header";
// import FooterPage from "../../utils/Footer/FooterPage";
// import { Link } from "react-router-dom";
// import { MainAPI } from "../API";
// import axios from "axios";
// import { convertSQLDate } from "../../utils/Format";
// import { Spinner } from "react-bootstrap";

// export default function Blog() {
//   const [blogs, setBlogs] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     axios
//       .get(`${MainAPI}/user/show-all-posts`)
//       .then((res) => {
//         setBlogs(res.data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error(err);
//         setLoading(false);
//       });
//   }, []);

//   return (
//     <div className="blog-page" style={{ backgroundColor: "#f5f7fd" }}>
//       <HeaderPage />

//       {loading ? (
//         <div className="text-center mt-5">
//           <Spinner animation="border" role="status" />
//         </div>
//       ) : (
//         <div className="container blog-container">
//           <div className="row">
//             {blogs.map((blog) => (
//               <div className="col-md-4 p-3" key={blog.post_id}>
//                 <Link to={`post/${blog.post_id}`} className="link">
//                   <div className="card content-card">
//                     <div className="img-container mb-3">
//                       <img src={blog.image_url} alt={blog.title} />
//                     </div>
//                     <div className="content-container">
//                       <h4>{blog.title}</h4>
//                       <div className="blog-content">{blog.content}</div>
//                       <div className="text-end mt-3">
//                         <p className="fs-6">
//                           {convertSQLDate(blog.post_date)}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </Link>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       <FooterPage />
//     </div>
//   );
// }



import React, { useEffect, useState } from "react";
import "./Blog.scss";
import HeaderPage from "../../utils/Header/Header";
import FooterPage from "../../utils/Footer/FooterPage";
import { Link } from "react-router-dom";
import { MainAPI } from "../API";
import axios from "axios";
import { Spinner } from "react-bootstrap";

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${MainAPI}/Blog/GetAllBlog`)
      .then((res) => {
        setBlogs(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="blog-page" style={{ backgroundColor: "#f5f7fd" }}>
      <HeaderPage />

      {loading ? (
        <div className="text-center mt-5">
          <Spinner animation="border" role="status" />
        </div>
      ) : (
        <div className="container blog-container">
          <div className="row">
            {blogs.map((blog) => (
              <div className="col-md-4 p-3" key={blog.blogId}>
                <Link to={`post/${blog.blogId}`} className="link">
                  <div className="card content-card">
                    <div className="img-container mb-3">
                      {blog.blogImage ? (
                        <img src={blog.blogImage} alt={blog.blogTitle} />
                      ) : (
                        <img src="https://via.placeholder.com/150" alt="Placeholder" />
                      )}
                    </div>
                    <div className="content-container">
                      <h4>{blog.blogTitle}</h4>
                      <div className="blog-content">{blog.blogContent}</div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      <FooterPage />
    </div>
  );
}

