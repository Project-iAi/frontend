cmake_minimum_required(VERSION 3.22.1)

project(FrontendRNiOS)

# React Native 기본 설정
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# 빈 타겟 생성 (CMake 오류 방지)
add_library(empty_lib SHARED empty.cpp)

# 빈 소스 파일 생성
file(WRITE ${CMAKE_CURRENT_SOURCE_DIR}/empty.cpp "// Empty file to satisfy CMake requirements\n")
