import Image from 'next/image';
import { MovieType } from 'types/Movie';
import * as S from './style';
import * as I from 'assets/svg';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { LikeMovie } from 'atoms';
import { css } from '@emotion/react';
import { likeButtonAnimation } from 'shared/styles/Animation';
import { getLocalstorage, setLocalstorage } from 'hooks';

interface MovieProps {
  movie: MovieType;
}

const Movie = ({ movie }: MovieProps) => {
  const [isLike, setIsLike] = useState<boolean>(false); // 좋아요 관리
  const [likeMovie, setLikeMovie] = useRecoilState(LikeMovie); // 좋아요 누른 영화 아이디 배열
  /**
   * 페이지 첫 렌더링 시 로컬스토리지에 저장된 likeMovie를 가져와 초기값 설정
   * likeMovie 아이디 값에 현재 movie.id 값이 있다면 좋아요 설정
   * 값이 없다면 return
   */
  const [user, setUser] = useState<string>();
  useEffect(() => {
    // 로컬스토리지에 저장된 유저 정보 가져오기
    const userInfo = ['year', 'month', 'date', 'name']
      .map(value => getLocalstorage(value))
      .join('');
    setUser(userInfo);

    const result = getLocalstorage(userInfo);
    if (result) {
      setIsLike(result.includes(movie.id.toString()));
      setLikeMovie(JSON.parse(result));
    }
  }, []);

  /**
   * 좋아요 버튼 눌렀을 때 실행시키는 함수
   */
  const handleLike = () => {
    setIsLike(!isLike);

    if (likeMovie) {
      // 저장한 영화가 이미 있고
      if (likeMovie.includes(movie.id)) {
        // 중복된 영화를 저장했을 때 (삭제)
        setLocalstorage(
          user,
          likeMovie.filter(value => value !== movie.id),
        );
        setLikeMovie(likeMovie.filter(value => value !== movie.id));
      } else {
        // 중복되지 않은 영화를 저장했을 때 (추가)
        setLocalstorage(user, [...likeMovie, movie.id]);
        setLikeMovie([...likeMovie, movie.id]);
      }
    } else {
      // 저장한 영화가 없을 때 실행
      setLocalstorage(user, [movie.id]);
      setLikeMovie([movie.id]);
    }
  };

  /**
   * 하트 클릭 시 애니메이션
   */
  const handleAnimation = () =>
    css({
      animation: `${likeButtonAnimation} .45s`,
    });

  return (
    <S.Movie>
      <S.MovieInfo href={`/movie/${movie.id}`}>
        <div
          css={css`
            position: relative;
            border-radius: 16px;
            overflow: hidden;
            width: 17vw;
            height: 41vh;
          `}
        >
          <Image
            layout="fill"
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt=""
          />
        </div>
        <S.Title>{movie.title}</S.Title>
        <S.Overview>{movie.overview}</S.Overview>
      </S.MovieInfo>
      <S.LikeButton onClick={handleLike}>
        {isLike ? (
          <div css={handleAnimation}>
            <I.PinkLikeIcon />
          </div>
        ) : (
          <I.LikeIcon />
        )}
      </S.LikeButton>
    </S.Movie>
  );
};

export default Movie;
