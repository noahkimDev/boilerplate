/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainImage from "./Sections/MainImage";
import { API_URL, API_KEY, IMAGE_BASE_URL } from "../../config";

function LandingPage() {
  const navigate = useNavigate();
  const [Movies, setMovies] = useState([]);
  const [MainMovieImage, setMainMovieImage] = useState(null);

  // LandingPage가 랜딩되자마자 실행되는 코드
  useEffect(() => {
    const endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
    axios
      .get(endpoint) //
      .then((res) => {
        console.log(res.data.results);
        setMovies([res.data.results]);
        setMainMovieImage(res.data.results[0]);
      })
      .catch((err) => console.log("에러", err));
  }, []);

  const onClickHandler = () => {
    axios.get("/api/users/logout").then((res) => {
      // console.log(res.data);
      if (res.data.success) {
        return navigate("/login");
      } else {
        alert("failed to logout");
      }
    });
  };

  return (
    <>
      <div style={{ width: "100%", margin: "0" }}>
        {/* main image */}
        {MainMovieImage && (
          <MainImage
            image={`${IMAGE_BASE_URL}w1280${MainMovieImage.backdrop_path}`}
            title={MainMovieImage.original_title}
            text={MainMovieImage.overview}
          />
        )}
        <div style={{ width: "85%", margin: "1rem auto" }}>
          <h2>Movies by latest</h2>
          <hr />
          {/* Movie Grid Cards */}
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button>Load More</button>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100vh",
        }}
      >
        <h2>시작페이지</h2>
        <button onClick={onClickHandler}>로그아웃</button>
      </div>
    </>
  );
}

export default LandingPage;
