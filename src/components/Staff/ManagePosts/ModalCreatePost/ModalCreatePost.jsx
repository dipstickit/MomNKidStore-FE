import React, { useEffect, useState } from "react";
import useAuth from "../../../../hooks/useAuth";
import axios from "axios";
import { MainAPI } from "../../../API";
import { toast, ToastContainer } from "react-toastify";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "./CreatePost.scss";
import { Navigate, useNavigate } from "react-router-dom";
import Select from "react-select";

const ENDPOINT = "staff/uploads";

function uploadAdapter(loader) {
  return {
    upload: () => {
      return new Promise((resolve, reject) => {
        const fd = new FormData();
        loader.file.then((file) => {
          // here check the mimetype and send request
          // to relevant backend api endpoint
          fd.append("uploads", file);
          fetch(`${MainAPI}/${ENDPOINT}`, {
            method: "POST",
            body: fd,
          })
            .then((res) => res.json())
            .then((res) => {
              resolve({ default: `${MainAPI}/${res.url}` });
            })
            .catch((err) => {
              reject(err);
            });
        });
      });
    },
  };
}

function uploadPlugin(editor) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
    return uploadAdapter(loader);
  };
}

export default function ModalCreatePost() {
  const { auth } = useAuth();
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [product, setProduct] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const nav = useNavigate();

  // console.log(selectedOptions.map((item) => item.value));

  useEffect(() => {
    fetchData();
  }, []);

  const options = product.map((item) => {
    return {
      value: item.product_id,
      label: item.product_name,
    };
  });

  const handleChange = (selectedOption) => {
    setSelectedOptions(selectedOption);
  };

  const fetchData = () => {
    axios
      .get(`${MainAPI}/staff/product`, {
        headers: {
          "x-access-token": JSON.parse(localStorage.getItem("accessToken")),
        },
      })
      .then((res) => {
        console.log(res.data);
        setProduct(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCreatePost = () => {
    axios
      .post(
        `${MainAPI}/staff/create-post`,
        {
          description: description,
          user_id: auth.user.user_id,
          title: title,
          image_url: image,
          productItems: selectedOptions.map((item) => item.value),
        },
        {
          headers: {
            "x-access-token": JSON.parse(localStorage.getItem("accessToken")),
          },
        }
      )
      .then((res) => {
        console.log(res);
        toast.success(res.data.message);
        setTimeout(() => {
          nav("/staff/manage_posts");
        }, 2000);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.errors[0].message);
      });
  };

  return (
    <div className="create-post-container">
      <ToastContainer autoClose={2000} />
      <div className="create-post-content">
        <h2 className="mb-3 mt-3">Create New Post</h2>
        <form class="row g-3">
          <div class="mb-3">
            <input
              type="email"
              class="form-control"
              placeholder="Post title"
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
          </div>
          <div class="mb-3">
            <input
              class="form-control"
              placeholder="Thumbnail Image URL"
              onChange={(e) => {
                setImage(e.target.value);
              }}
            ></input>
          </div>
        </form>
        <div style={{ marginBottom: "30px" }}>
          <Select
            options={options}
            onChange={handleChange}
            value={selectedOptions}
            isMulti={true}
          />
        </div>
        <CKEditor
          config={{
            extraPlugins: [uploadPlugin],
          }}
          editor={ClassicEditor}
          data="<p>Insert text here&nbsp;!</p>"
          onReady={(editor) => {
            // You can store the "editor" and use when it is needed.
            console.log("Editor is ready to use!", editor);
          }}
          onChange={(event, editor) => {
            const data = editor.getData();
            setDescription(data);
            // console.log(data);
          }}
          onBlur={(event, editor) => {
            // console.log("Blur.", editor);
          }}
          onFocus={(event, editor) => {
            // console.log("Focus.", editor);
          }}
        />
      </div>
      <div className="d-flex justify-content-end mt-3">
        <button
          className="btn btn-danger"
          onClick={() => {
            nav("/staff/manage_posts");
          }}
        >
          Cancel
        </button>
        <button className="btn btn-primary" onClick={handleCreatePost}>
          Submit
        </button>
      </div>
    </div>
  );
}
