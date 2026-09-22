/* =========================================================
   ARTHA · WebGL scene
   Gold contour ridges (GPU-displaced line field) + dust + a floating
   3D report with a companion slide deck. data-mode="hero" | "terrain"
   ========================================================= */
import * as THREE from 'three';

const MARK = ['M72.00 79.14C71.43 79.12 70.86 79.16 70.29 79.23C69.71 79.29 69.14 79.39 68.57 79.50C67.99 79.61 67.42 79.75 66.86 79.88C66.29 80.02 65.72 80.15 65.16 80.30C64.60 80.45 64.04 80.60 63.49 80.77C62.93 80.93 62.38 81.10 61.83 81.27C61.28 81.45 60.73 81.63 60.18 81.81C59.64 81.99 59.09 82.18 58.55 82.37C58.00 82.56 57.41 82.74 56.92 82.94C56.42 83.14 55.91 83.35 55.56 83.57C55.22 83.80 54.92 84.03 54.84 84.27C54.76 84.51 54.87 84.77 55.09 85.02C55.31 85.26 55.72 85.51 56.15 85.74C56.58 85.97 57.14 86.20 57.66 86.42C58.18 86.64 58.73 86.85 59.26 87.06C59.80 87.28 60.33 87.49 60.86 87.71C61.40 87.92 61.93 88.14 62.46 88.35C63.00 88.57 63.53 88.78 64.06 89.00C64.60 89.21 65.13 89.42 65.67 89.63C66.21 89.84 66.74 90.04 67.28 90.25C67.82 90.46 68.35 90.67 68.89 90.87C69.43 91.07 69.97 91.28 70.51 91.47C71.05 91.67 71.59 91.86 72.14 92.05C72.68 92.24 73.23 92.41 73.78 92.59C74.33 92.76 74.88 92.94 75.44 93.10C75.99 93.26 76.55 93.42 77.11 93.57C77.67 93.73 78.23 93.88 78.79 94.01C79.36 94.15 79.93 94.28 80.50 94.40C81.07 94.52 81.65 94.63 82.23 94.73C82.82 94.82 83.41 94.90 84.00 94.96C84.60 95.03 85.20 95.07 85.80 95.09C86.41 95.11 87.02 95.12 87.62 95.09C88.22 95.06 88.82 95.01 89.40 94.92C89.99 94.83 90.58 94.72 91.12 94.55C91.66 94.38 92.20 94.17 92.65 93.89C93.10 93.62 93.54 93.28 93.83 92.88C94.13 92.49 94.35 92.01 94.44 91.52C94.54 91.04 94.52 90.49 94.41 89.97C94.31 89.46 94.07 88.93 93.79 88.44C93.52 87.95 93.16 87.47 92.77 87.04C92.39 86.60 91.95 86.19 91.50 85.82C91.05 85.45 90.56 85.11 90.07 84.81C89.57 84.51 89.06 84.25 88.53 84.02C88.00 83.79 87.46 83.60 86.91 83.41C86.37 83.22 85.81 83.06 85.26 82.90C84.71 82.73 84.15 82.58 83.59 82.42C83.03 82.26 82.48 82.09 81.93 81.93C81.37 81.76 80.82 81.60 80.27 81.43C79.71 81.26 79.16 81.08 78.62 80.90C78.07 80.72 77.53 80.53 76.98 80.34C76.44 80.16 75.90 79.94 75.35 79.78C74.80 79.61 74.25 79.45 73.69 79.34C73.14 79.23 72.57 79.15 72.00 79.14ZM53.33 8.95C52.94 9.07 52.59 9.25 52.45 9.50C52.31 9.76 52.37 10.12 52.50 10.49C52.63 10.87 52.93 11.31 53.22 11.76C53.51 12.20 53.90 12.69 54.23 13.17C54.56 13.65 54.88 14.14 55.18 14.63C55.48 15.13 55.75 15.63 56.02 16.14C56.28 16.65 56.52 17.17 56.75 17.69C56.99 18.22 57.21 18.74 57.42 19.28C57.62 19.81 57.81 20.35 58.00 20.89C58.18 21.43 58.36 21.98 58.53 22.53C58.69 23.08 58.85 23.63 59.00 24.19C59.15 24.75 59.29 25.31 59.43 25.87C59.57 26.43 59.69 27.00 59.82 27.57C59.94 28.14 60.05 28.71 60.16 29.28C60.27 29.86 60.38 30.43 60.47 31.01C60.57 31.59 60.66 32.17 60.75 32.75C60.84 33.33 60.93 33.92 61.00 34.51C61.07 35.09 61.13 35.69 61.18 36.29C61.23 36.88 61.26 37.49 61.28 38.09C61.30 38.69 61.31 39.30 61.30 39.90C61.29 40.51 61.26 41.11 61.21 41.71C61.17 42.30 61.12 42.90 61.04 43.49C60.97 44.07 60.87 44.65 60.76 45.23C60.66 45.80 60.54 46.37 60.40 46.93C60.26 47.50 60.11 48.05 59.95 48.60C59.78 49.15 59.60 49.70 59.41 50.24C59.21 50.77 59.01 51.31 58.78 51.83C58.56 52.36 58.31 52.88 58.06 53.39C57.80 53.91 57.54 54.41 57.25 54.92C56.97 55.42 56.66 55.91 56.35 56.40C56.04 56.89 55.73 57.38 55.39 57.86C55.06 58.34 54.71 58.81 54.35 59.28C54.00 59.75 53.63 60.22 53.25 60.67C52.87 61.13 52.47 61.58 52.06 62.02C51.66 62.46 51.24 62.90 50.81 63.33C50.39 63.77 49.96 64.19 49.52 64.61C49.08 65.03 48.64 65.44 48.19 65.84C47.75 66.24 47.30 66.64 46.84 67.02C46.39 67.41 45.93 67.78 45.46 68.15C45.00 68.52 44.53 68.88 44.06 69.23C43.58 69.58 43.10 69.92 42.62 70.25C42.14 70.58 41.66 70.90 41.17 71.22C40.68 71.54 40.19 71.84 39.69 72.14C39.20 72.45 38.70 72.74 38.20 73.03C37.70 73.32 37.20 73.60 36.70 73.88C36.20 74.16 35.69 74.44 35.19 74.72C34.68 74.99 34.18 75.27 33.67 75.53C33.16 75.80 32.65 76.05 32.13 76.30C31.61 76.55 31.09 76.79 30.57 77.02C30.05 77.26 29.52 77.48 29.00 77.70C28.47 77.93 27.95 78.16 27.42 78.38C26.89 78.60 26.36 78.82 25.83 79.03C25.30 79.25 24.77 79.46 24.24 79.67C23.71 79.87 23.17 80.07 22.63 80.26C22.09 80.45 21.55 80.64 21.00 80.82C20.46 81.00 19.91 81.17 19.36 81.34C18.82 81.51 18.27 81.68 17.71 81.84C17.16 82.01 16.61 82.17 16.06 82.33C15.51 82.49 14.95 82.65 14.40 82.80C13.84 82.96 13.29 83.11 12.73 83.26C12.17 83.40 11.61 83.54 11.04 83.67C10.48 83.80 9.91 83.93 9.34 84.04C8.77 84.15 8.19 84.26 7.61 84.34C7.02 84.42 6.43 84.49 5.84 84.52C5.25 84.55 4.64 84.51 4.08 84.50C3.51 84.49 2.93 84.43 2.46 84.46C1.99 84.48 1.55 84.49 1.24 84.65C0.94 84.81 0.73 85.09 0.64 85.43C0.54 85.77 0.58 86.24 0.67 86.71C0.76 87.18 0.95 87.75 1.17 88.26C1.39 88.77 1.67 89.29 1.97 89.78C2.28 90.27 2.61 90.74 2.98 91.18C3.35 91.62 3.77 92.05 4.20 92.42C4.63 92.80 5.10 93.14 5.59 93.44C6.08 93.73 6.59 93.99 7.12 94.20C7.65 94.41 8.21 94.57 8.77 94.70C9.33 94.84 9.92 94.93 10.50 94.99C11.09 95.06 11.70 95.10 12.30 95.11C12.90 95.13 13.51 95.11 14.11 95.08C14.71 95.05 15.30 95.00 15.89 94.92C16.48 94.85 17.06 94.75 17.63 94.65C18.21 94.54 18.78 94.42 19.35 94.30C19.91 94.17 20.48 94.04 21.04 93.89C21.60 93.75 22.15 93.60 22.71 93.44C23.26 93.29 23.81 93.11 24.36 92.94C24.90 92.77 25.45 92.59 25.99 92.42C26.54 92.24 27.08 92.06 27.63 91.87C28.17 91.69 28.71 91.51 29.26 91.32C29.80 91.14 30.34 90.95 30.88 90.75C31.41 90.55 31.95 90.36 32.48 90.15C33.02 89.95 33.55 89.74 34.08 89.53C34.61 89.32 35.14 89.10 35.68 88.89C36.21 88.68 36.74 88.47 37.27 88.25C37.80 88.04 38.33 87.83 38.86 87.62C39.39 87.41 39.93 87.20 40.46 86.99C40.99 86.77 41.52 86.56 42.05 86.34C42.58 86.13 43.11 85.92 43.64 85.71C44.17 85.50 44.70 85.28 45.23 85.07C45.77 84.86 46.30 84.64 46.83 84.43C47.36 84.22 47.89 84.01 48.42 83.80C48.95 83.59 49.48 83.37 50.02 83.17C50.55 82.96 51.09 82.77 51.63 82.57C52.16 82.37 52.70 82.17 53.24 81.98C53.78 81.78 54.32 81.59 54.86 81.41C55.40 81.22 55.94 81.03 56.49 80.85C57.03 80.67 57.58 80.50 58.12 80.33C58.67 80.15 59.22 79.98 59.77 79.81C60.32 79.65 60.87 79.48 61.42 79.32C61.98 79.16 62.53 79.01 63.09 78.86C63.65 78.72 64.21 78.58 64.78 78.45C65.34 78.33 65.91 78.21 66.49 78.10C67.06 77.98 67.63 77.88 68.21 77.78C68.79 77.68 69.37 77.58 69.95 77.50C70.54 77.42 71.13 77.35 71.72 77.29C72.32 77.24 72.92 77.20 73.52 77.18C74.12 77.16 74.73 77.16 75.33 77.18C75.94 77.19 76.54 77.23 77.14 77.28C77.73 77.33 78.33 77.40 78.91 77.49C79.49 77.58 80.06 77.69 80.62 77.83C81.19 77.96 81.74 78.12 82.29 78.30C82.83 78.47 83.37 78.68 83.90 78.88C84.43 79.09 84.96 79.31 85.48 79.54C86.01 79.77 86.53 80.02 87.04 80.27C87.55 80.52 88.07 80.78 88.57 81.06C89.07 81.34 89.57 81.63 90.06 81.94C90.55 82.26 91.04 82.58 91.51 82.93C91.98 83.29 92.44 83.66 92.87 84.06C93.31 84.45 93.74 84.86 94.12 85.30C94.50 85.74 94.84 86.23 95.15 86.69C95.46 87.15 95.73 87.67 95.98 88.06C96.23 88.46 96.44 88.86 96.67 89.05C96.90 89.24 97.13 89.32 97.36 89.22C97.59 89.13 97.84 88.83 98.07 88.48C98.30 88.13 98.54 87.61 98.74 87.12C98.94 86.62 99.14 86.04 99.29 85.49C99.45 84.93 99.57 84.36 99.66 83.79C99.75 83.22 99.82 82.63 99.85 82.04C99.87 81.45 99.85 80.86 99.80 80.27C99.75 79.69 99.66 79.11 99.54 78.54C99.41 77.98 99.25 77.43 99.05 76.89C98.85 76.35 98.63 75.83 98.36 75.32C98.10 74.81 97.80 74.31 97.48 73.82C97.16 73.34 96.81 72.87 96.44 72.40C96.08 71.94 95.68 71.49 95.28 71.03C94.89 70.58 94.48 70.14 94.08 69.69C93.67 69.24 93.27 68.79 92.87 68.34C92.47 67.89 92.07 67.44 91.68 66.98C91.29 66.52 90.91 66.06 90.54 65.60C90.17 65.13 89.80 64.67 89.45 64.19C89.10 63.72 88.76 63.24 88.43 62.76C88.09 62.28 87.77 61.80 87.44 61.31C87.12 60.82 86.81 60.33 86.50 59.85C86.18 59.36 85.87 58.87 85.57 58.37C85.27 57.88 84.97 57.38 84.68 56.88C84.39 56.38 84.11 55.88 83.83 55.38C83.55 54.88 83.28 54.37 83.00 53.86C82.73 53.36 82.46 52.85 82.19 52.35C81.92 51.84 81.66 51.33 81.40 50.82C81.14 50.30 80.88 49.79 80.63 49.28C80.38 48.76 80.14 48.24 79.89 47.73C79.64 47.21 79.40 46.69 79.15 46.17C78.91 45.66 78.66 45.14 78.42 44.62C78.18 44.10 77.94 43.58 77.71 43.06C77.47 42.54 77.24 42.02 77.00 41.49C76.77 40.97 76.55 40.45 76.32 39.92C76.09 39.40 75.85 38.88 75.63 38.35C75.40 37.83 75.18 37.30 74.95 36.77C74.73 36.25 74.50 35.72 74.27 35.20C74.05 34.67 73.83 34.14 73.60 33.62C73.38 33.09 73.15 32.57 72.93 32.04C72.70 31.52 72.47 30.99 72.24 30.47C72.01 29.94 71.79 29.42 71.56 28.89C71.33 28.37 71.09 27.85 70.86 27.33C70.63 26.80 70.40 26.28 70.17 25.76C69.94 25.23 69.70 24.71 69.46 24.19C69.22 23.67 68.98 23.15 68.73 22.64C68.48 22.12 68.23 21.61 67.96 21.10C67.70 20.59 67.43 20.08 67.16 19.58C66.88 19.07 66.60 18.57 66.31 18.07C66.03 17.57 65.73 17.07 65.43 16.58C65.13 16.08 64.83 15.59 64.52 15.10C64.20 14.61 63.88 14.12 63.54 13.65C63.19 13.19 62.84 12.72 62.45 12.30C62.06 11.87 61.65 11.46 61.20 11.11C60.76 10.75 60.29 10.43 59.79 10.16C59.30 9.88 58.77 9.66 58.23 9.47C57.70 9.28 57.13 9.13 56.56 9.02C55.99 8.92 55.36 8.83 54.83 8.82C54.29 8.81 53.73 8.84 53.33 8.95ZM48.55 4.99C47.96 5.02 47.38 5.09 46.80 5.20C46.23 5.31 45.67 5.45 45.13 5.63C44.58 5.81 44.05 6.03 43.53 6.28C43.02 6.53 42.52 6.82 42.03 7.13C41.54 7.45 41.07 7.80 40.61 8.17C40.15 8.54 39.71 8.94 39.27 9.35C38.84 9.77 38.42 10.19 38.01 10.63C37.61 11.07 37.22 11.53 36.84 11.99C36.47 12.45 36.12 12.92 35.77 13.40C35.43 13.88 35.11 14.36 34.79 14.85C34.47 15.34 34.17 15.84 33.87 16.33C33.57 16.83 33.27 17.33 32.99 17.83C32.70 18.33 32.42 18.84 32.15 19.34C31.87 19.85 31.61 20.36 31.35 20.87C31.09 21.39 30.83 21.90 30.58 22.42C30.33 22.94 30.09 23.46 29.85 23.98C29.61 24.50 29.37 25.02 29.13 25.54C28.90 26.07 28.67 26.59 28.44 27.12C28.21 27.64 27.97 28.17 27.74 28.69C27.51 29.22 27.29 29.75 27.06 30.27C26.84 30.80 26.61 31.33 26.39 31.85C26.16 32.38 25.95 32.91 25.73 33.44C25.51 33.97 25.28 34.50 25.06 35.03C24.84 35.56 24.62 36.09 24.39 36.61C24.17 37.14 23.94 37.67 23.71 38.20C23.49 38.72 23.26 39.25 23.03 39.77C22.80 40.30 22.57 40.82 22.33 41.35C22.10 41.87 21.86 42.39 21.63 42.92C21.39 43.44 21.15 43.96 20.92 44.49C20.69 45.01 20.46 45.54 20.22 46.06C19.99 46.58 19.75 47.11 19.51 47.63C19.27 48.15 19.02 48.67 18.77 49.18C18.52 49.70 18.26 50.21 18.00 50.72C17.74 51.24 17.48 51.75 17.22 52.26C16.96 52.77 16.69 53.28 16.42 53.79C16.15 54.30 15.88 54.81 15.60 55.32C15.32 55.82 15.03 56.32 14.74 56.82C14.45 57.32 14.16 57.82 13.86 58.32C13.56 58.82 13.25 59.31 12.94 59.80C12.62 60.29 12.31 60.78 11.99 61.27C11.66 61.75 11.33 62.23 10.99 62.71C10.65 63.19 10.31 63.66 9.95 64.14C9.60 64.61 9.24 65.07 8.87 65.54C8.51 66.00 8.13 66.47 7.75 66.92C7.36 67.38 6.96 67.83 6.56 68.28C6.16 68.73 5.75 69.17 5.34 69.62C4.94 70.07 4.52 70.50 4.13 70.95C3.74 71.41 3.35 71.86 3.00 72.33C2.65 72.80 2.31 73.28 2.04 73.79C1.77 74.30 1.54 74.83 1.39 75.37C1.24 75.91 1.16 76.49 1.16 77.05C1.16 77.61 1.23 78.19 1.38 78.73C1.53 79.26 1.77 79.79 2.06 80.24C2.36 80.69 2.73 81.11 3.15 81.43C3.57 81.76 4.08 82.03 4.58 82.21C5.09 82.39 5.65 82.49 6.19 82.51C6.73 82.53 7.29 82.45 7.83 82.32C8.37 82.20 8.89 81.98 9.41 81.76C9.93 81.54 10.44 81.25 10.95 80.99C11.47 80.73 11.97 80.45 12.49 80.20C13.00 79.94 13.52 79.69 14.04 79.46C14.57 79.22 15.10 79.01 15.63 78.80C16.17 78.59 16.71 78.40 17.25 78.22C17.80 78.05 18.36 77.90 18.93 77.76C19.49 77.63 20.07 77.52 20.65 77.43C21.23 77.33 21.83 77.28 22.42 77.20C23.00 77.12 23.60 77.06 24.17 76.95C24.75 76.84 25.32 76.71 25.87 76.54C26.41 76.36 26.94 76.14 27.46 75.90C27.99 75.66 28.49 75.39 29.00 75.12C29.51 74.85 30.01 74.57 30.52 74.29C31.02 74.01 31.53 73.73 32.03 73.44C32.53 73.15 33.03 72.86 33.53 72.56C34.02 72.26 34.52 71.95 35.01 71.64C35.50 71.33 35.99 71.02 36.48 70.70C36.97 70.37 37.45 70.05 37.94 69.72C38.42 69.39 38.90 69.05 39.38 68.71C39.86 68.37 40.34 68.02 40.81 67.67C41.29 67.32 41.76 66.97 42.23 66.60C42.70 66.24 43.18 65.87 43.63 65.49C44.08 65.11 44.55 64.72 44.92 64.31C45.28 63.90 45.63 63.48 45.82 63.04C46.02 62.61 46.12 62.15 46.08 61.70C46.05 61.24 45.85 60.77 45.63 60.30C45.40 59.83 45.06 59.36 44.74 58.88C44.42 58.40 44.06 57.92 43.73 57.44C43.41 56.95 43.09 56.46 42.79 55.96C42.49 55.47 42.20 54.97 41.93 54.46C41.65 53.95 41.39 53.44 41.14 52.92C40.89 52.40 40.66 51.88 40.44 51.35C40.22 50.82 40.02 50.28 39.83 49.74C39.65 49.20 39.47 48.65 39.31 48.09C39.15 47.54 39.01 46.98 38.88 46.41C38.75 45.84 38.63 45.27 38.53 44.69C38.43 44.11 38.35 43.53 38.28 42.94C38.21 42.35 38.15 41.74 38.12 41.14C38.08 40.54 38.06 39.93 38.06 39.32C38.06 38.71 38.08 38.10 38.12 37.50C38.15 36.89 38.21 36.29 38.27 35.70C38.33 35.10 38.40 34.51 38.48 33.92C38.56 33.34 38.65 32.75 38.74 32.17C38.83 31.59 38.92 31.00 39.02 30.42C39.12 29.84 39.23 29.27 39.34 28.69C39.45 28.12 39.57 27.55 39.70 26.98C39.82 26.41 39.95 25.85 40.09 25.28C40.23 24.72 40.38 24.16 40.54 23.60C40.69 23.05 40.86 22.50 41.03 21.95C41.21 21.40 41.39 20.85 41.58 20.31C41.78 19.77 41.99 19.24 42.20 18.71C42.42 18.18 42.65 17.65 42.89 17.13C43.14 16.61 43.41 16.10 43.69 15.60C43.96 15.09 44.25 14.59 44.56 14.10C44.87 13.61 45.20 13.12 45.55 12.65C45.89 12.18 46.25 11.71 46.64 11.27C47.04 10.83 47.45 10.41 47.89 10.02C48.33 9.63 48.79 9.26 49.27 8.94C49.75 8.61 50.25 8.32 50.76 8.06C51.27 7.79 51.85 7.57 52.31 7.35C52.77 7.13 53.25 6.95 53.54 6.75C53.82 6.56 54.04 6.36 54.02 6.18C54.00 5.99 53.75 5.81 53.42 5.65C53.10 5.50 52.58 5.34 52.07 5.23C51.55 5.12 50.91 5.05 50.32 5.01C49.73 4.97 49.14 4.96 48.55 4.99Z'];

const NOISE = /* glsl */`
vec3 permute(vec3 x){return mod(((x*34.0)+1.0)*x,289.0);}
float snoise(vec2 v){
  const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
  vec2 i=floor(v+dot(v,C.yy)); vec2 x0=v-i+dot(i,C.xx);
  vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
  vec4 x12=x0.xyxy+C.xxzz; x12.xy-=i1; i=mod(i,289.0);
  vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
  vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0); m=m*m; m=m*m;
  vec3 x=2.0*fract(p*C.www)-1.0; vec3 h=abs(x)-0.5; vec3 ox=floor(x+0.5); vec3 a0=x-ox;
  m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);
  vec3 g; g.x=a0.x*x0.x+h.x*x0.y; g.yz=a0.yz*x12.xz+h.yz*x12.yw; return 130.0*dot(m,g);
}
float ridge(vec2 p){ float s=0.0, a=0.5, f=1.0; for(int i=0;i<5;i++){ float n=1.0-abs(snoise(p*f)); s+=n*n*a; f*=2.03; a*=0.5; } return s; }
`;

function makeCover({ title, sub, tone }) {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 1434;
  const g = c.getContext('2d');
  const bg = tone === 'bronze' ? '#8A6A2F' : '#143D33';
  g.fillStyle = bg; g.fillRect(0, 0, c.width, c.height);
  const grd = g.createLinearGradient(0, 0, c.width, c.height);
  grd.addColorStop(0, 'rgba(255,255,255,0.07)'); grd.addColorStop(0.5, 'rgba(255,255,255,0)'); grd.addColorStop(1, 'rgba(0,0,0,0.18)');
  g.fillStyle = grd; g.fillRect(0, 0, c.width, c.height);
  // mark
  g.save(); g.translate(96, 96); g.scale(1.2, 1.2); g.fillStyle = '#F7F3EA';
  MARK.forEach(d => g.fill(new Path2D(d), 'evenodd')); g.restore();
  g.fillStyle = '#E4D2A6'; g.font = '500 30px "JetBrains Mono", monospace';
  g.fillText('ARTHA EQUITIES  ·  RESEARCH', 96, 300);
  g.fillStyle = '#C8A96B'; g.fillRect(96, 330, 520, 2);
  g.fillStyle = '#F7F3EA'; g.font = '500 116px Zodiak, Georgia, serif';
  title.forEach((l, i) => g.fillText(l, 90, 480 + i * 124));
  g.fillStyle = '#E4D2A6'; g.font = 'italic 400 84px Zodiak, Georgia, serif';
  g.fillText(sub, 92, 480 + title.length * 124 + 10);
  // ridges
  g.strokeStyle = 'rgba(200,169,107,0.9)'; g.lineWidth = 2.5;
  for (let k = 0; k < 5; k++) {
    g.beginPath(); g.globalAlpha = 1 - k * 0.17;
    for (let x = 0; x <= c.width; x += 8) {
      const y = 1180 - k * 34 - Math.abs(Math.sin(x * 0.006 + k) * 120) - Math.sin(x * 0.017 + k * 2) * 26;
      x === 0 ? g.moveTo(x, y) : g.lineTo(x, y);
    }
    g.stroke();
  }
  g.globalAlpha = 1; g.fillStyle = 'rgba(247,243,234,0.6)'; g.font = '400 26px "JetBrains Mono", monospace';
  g.fillText('ILLUSTRATIVE DATA  ·  VOL. 01  ·  2026', 96, 1350);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}

function makeDeck() {
  const c = document.createElement('canvas'); c.width = 1280; c.height = 800;
  const g = c.getContext('2d');
  g.fillStyle = '#FFFFFF'; g.fillRect(0, 0, c.width, c.height);
  g.fillStyle = '#123C32'; g.fillRect(0, 0, c.width, 90);
  g.fillStyle = '#C8A96B'; g.font = '500 26px "JetBrains Mono", monospace'; g.fillText('SECTOR EXPOSURE  ·  SLIDE 04', 48, 56);
  g.fillStyle = '#123C32'; g.font = '500 58px Zodiak, Georgia, serif'; g.fillText('Where the weight sits', 48, 190);
  const bars = [0.82, 0.64, 0.51, 0.38, 0.27, 0.16], cols = ['#123C32', '#7C9186', '#C8A96B', '#123C32', '#7C9186', '#C8A96B'];
  bars.forEach((b, i) => {
    g.fillStyle = '#D9D4C8'; g.fillRect(300, 260 + i * 78, 860, 34);
    g.fillStyle = cols[i]; g.fillRect(300, 260 + i * 78, 860 * b, 34);
    g.fillStyle = '#252525'; g.font = '400 26px "General Sans", Arial'; g.fillText(['Financials', 'Technology', 'Energy', 'Consumer', 'Industrials', 'Healthcare'][i], 48, 287 + i * 78);
  });
  g.fillStyle = '#7C9186'; g.font = '400 22px "JetBrains Mono", monospace'; g.fillText('ILLUSTRATIVE DATA. NOT A REAL CLIENT.', 48, 760);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}

function makeInner(kind) {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 1434;
  const g = c.getContext('2d');
  g.fillStyle = '#FBF8F1'; g.fillRect(0, 0, c.width, c.height);
  g.fillStyle = '#7C9186'; g.font = '500 24px "JetBrains Mono", monospace';
  g.fillText(kind === 'toc' ? 'CONTENTS' : '01 · ALLOCATION', 80, 110);
  g.fillStyle = '#D9D4C8'; g.fillRect(80, 135, 864, 2);
  g.fillStyle = '#123C32'; g.font = '500 70px Zodiak, Georgia, serif';
  if (kind === 'toc') {
    g.fillText('Inside this report', 80, 250);
    ['Allocation', 'Sector exposure', 'Concentration', 'Holdings-level observations', 'Market context', 'Methodology and disclaimer'].forEach((t, i) => {
      const y = 380 + i * 118;
      g.fillStyle = '#86652A'; g.font = '500 30px "JetBrains Mono", monospace'; g.fillText(String(i + 1).padStart(2, '0'), 80, y);
      g.fillStyle = '#252525'; g.font = '400 44px "General Sans", Arial'; g.fillText(t, 170, y);
      g.fillStyle = '#D9D4C8'; g.fillRect(80, y + 36, 864, 2);
    });
  } else {
    g.fillText('How it is allocated', 80, 250);
    const segs = [[0.48, '#123C32'], [0.27, '#7C9186'], [0.15, '#C8A96B'], [0.10, '#D9D4C8']];
    let a = -Math.PI / 2; g.lineWidth = 90;
    segs.forEach(([v, col]) => { g.beginPath(); g.strokeStyle = col; g.arc(330, 620, 190, a, a + v * Math.PI * 2); g.stroke(); a += v * Math.PI * 2; });
    ['Large cap  48%', 'Mid cap  27%', 'Small cap  15%', 'Cash and other  10%'].forEach((t, i) => {
      g.fillStyle = segs[i][1]; g.fillRect(620, 500 + i * 70, 34, 34);
      g.fillStyle = '#252525'; g.font = '400 34px "General Sans", Arial'; g.fillText(t, 675, 530 + i * 70);
    });
    g.fillStyle = '#D9D4C8'; for (let i = 0; i < 6; i++) g.fillRect(80, 930 + i * 46, i % 3 === 2 ? 560 : 864, 12);
  }
  g.save(); g.translate(512, 760); g.rotate(-0.42); g.strokeStyle = 'rgba(166,58,43,0.35)'; g.lineWidth = 3; g.strokeRect(-330, -44, 660, 88);
  g.fillStyle = 'rgba(166,58,43,0.45)'; g.font = '500 34px "JetBrains Mono", monospace'; g.textAlign = 'center'; g.fillText('ILLUSTRATIVE DATA. NOT A REAL CLIENT.', 0, 12); g.restore();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}

function pageEdges(horizontal) {
  const c = document.createElement('canvas'); c.width = 256; c.height = 256; const g = c.getContext('2d');
  g.fillStyle = '#F4EEE1'; g.fillRect(0, 0, 256, 256);
  g.fillStyle = 'rgba(160,150,130,0.35)';
  for (let i = 0; i < 256; i += 3) horizontal ? g.fillRect(0, i, 256, 1) : g.fillRect(i, 0, 1, 256);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

export function mount(el) {
  const mode = el.dataset.mode || 'hero';
  const reduce = window.Artha ? window.Artha.reduce : matchMedia('(prefers-reduced-motion: reduce)').matches;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  el.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 200);
  const camBase = new THREE.Vector3(0, 3.4, 12);
  camera.position.copy(camBase);

  /* ---- ridge field ---- */
  const ROWS = mode === 'hero' ? 78 : 56, COLS = 240;
  const pos = new Float32Array(ROWS * COLS * 3), idx = [];
  for (let r = 0; r < ROWS; r++) {
    const z = 8 - r * (82 / ROWS);
    for (let c = 0; c < COLS; c++) {
      const i = r * COLS + c;
      pos[i * 3] = -46 + (c / (COLS - 1)) * 92; pos[i * 3 + 1] = 0; pos[i * 3 + 2] = z;
      if (c < COLS - 1) idx.push(i, i + 1);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setIndex(idx);
  const uniforms = {
    uTime: { value: 0 }, uRise: { value: reduce ? 1 : 0 }, uMouse: { value: new THREE.Vector2(0, -10) },
    uGold: { value: new THREE.Color('#C8A96B') }, uSage: { value: new THREE.Color('#7C9186') }, uFlow: { value: 0 },
  };
  const ridgeMat = new THREE.ShaderMaterial({
    uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: NOISE + /* glsl */`
      uniform float uTime, uRise, uFlow; uniform vec2 uMouse;
      varying float vH; varying float vD; varying float vX;
      void main(){
        vec3 p = position;
        float back = smoothstep(6.0, -46.0, p.z);
        vec2 q = vec2(p.x * 0.055, (p.z - uFlow) * 0.07);
        float h = ridge(q + vec2(uTime * 0.012, 0.0));
        h = pow(h, 1.6) * mix(0.5, 13.0, back);
        float d = distance(p.xz, uMouse);
        h += exp(-d * d * 0.015) * 2.6 * (1.0 - back * 0.5);
        h += sin(p.x * 0.35 + uTime * 0.6 + p.z * 0.2) * 0.08;
        p.y = h * uRise - 1.6;
        vH = h; vX = p.x;
        vec4 mv = modelViewMatrix * vec4(p, 1.0); vD = -mv.z;
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */`
      uniform vec3 uGold, uSage; varying float vH; varying float vD; varying float vX;
      void main(){
        float near = smoothstep(2.0, 9.0, vD);
        float far = 1.0 - smoothstep(40.0, 88.0, vD);
        float sides = 1.0 - smoothstep(26.0, 46.0, abs(vX));
        vec3 col = mix(uSage, uGold, smoothstep(0.4, 6.5, vH));
        float a = near * far * sides * (0.22 + smoothstep(0.5, 9.0, vH) * 0.78);
        gl_FragColor = vec4(col, a * 0.9);
      }`,
  });
  const ridges = new THREE.LineSegments(geo, ridgeMat);
  scene.add(ridges);

  /* ---- dust ---- */
  const N = 900, dp = new Float32Array(N * 3), ds = new Float32Array(N);
  for (let i = 0; i < N; i++) { dp[i * 3] = (Math.random() - 0.5) * 60; dp[i * 3 + 1] = Math.random() * 14 - 1; dp[i * 3 + 2] = -Math.random() * 60 + 8; ds[i] = Math.random(); }
  const dGeo = new THREE.BufferGeometry();
  dGeo.setAttribute('position', new THREE.BufferAttribute(dp, 3)); dGeo.setAttribute('aSeed', new THREE.BufferAttribute(ds, 1));
  const dust = new THREE.Points(dGeo, new THREE.ShaderMaterial({
    uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: /* glsl */`uniform float uTime; attribute float aSeed; varying float vA;
      void main(){ vec3 p = position; p.y += sin(uTime * 0.3 + aSeed * 30.0) * 0.6; p.x += cos(uTime * 0.2 + aSeed * 20.0) * 0.4;
        vec4 mv = modelViewMatrix * vec4(p, 1.0); gl_PointSize = (1.5 + aSeed * 2.5) * (18.0 / -mv.z); vA = (0.3 + aSeed * 0.7) * (0.5 + 0.5 * sin(uTime + aSeed * 50.0));
        gl_Position = projectionMatrix * mv; }`,
    fragmentShader: /* glsl */`uniform vec3 uGold; varying float vA; void main(){ float d = length(gl_PointCoord - 0.5); if(d > 0.5) discard; gl_FragColor = vec4(uGold, vA * smoothstep(0.5, 0.0, d) * 0.8); }`,
  }));
  scene.add(dust);

  /* ---- floating report + deck ---- */
  let book = null, deck = null, group = null;
  if (mode === 'hero') {
    scene.add(new THREE.AmbientLight('#fff6e6', 1.2));
    const key = new THREE.DirectionalLight('#ffe9c2', 2.4); key.position.set(-4, 6, 8); scene.add(key);
    const rim = new THREE.DirectionalLight('#C8A96B', 3); rim.position.set(6, 2, -4); scene.add(rim);
    group = new THREE.Group(); scene.add(group);
    const cover = makeCover({ title: ['Portfolio', 'Intelligence'], sub: 'Report', tone: 'forest' });
    const side = new THREE.MeshStandardMaterial({ map: pageEdges(false), roughness: 0.9 });
    const top = new THREE.MeshStandardMaterial({ map: pageEdges(true), roughness: 0.9 });
    const spine = new THREE.MeshStandardMaterial({ color: '#0c2d25', roughness: 0.6 });
    const front = new THREE.MeshStandardMaterial({ map: cover, roughness: 0.45, metalness: 0.05 });
    const back = new THREE.MeshStandardMaterial({ color: '#0E3029', roughness: 0.6 });
    // hinged book: page block + back board + cover on a spine pivot
    book = new THREE.Group(); group.add(book);
    const pageMat = new THREE.MeshStandardMaterial({ map: makeInner('page'), roughness: 0.85 });
    const block = new THREE.Mesh(new THREE.BoxGeometry(2.92, 4.12, 0.26), [side, spine, top, top, pageMat, back]);
    book.add(block);
    const board = new THREE.Mesh(new THREE.BoxGeometry(3, 4.2, 0.04), [spine, spine, spine, spine, back, back]);
    board.position.z = -0.15; book.add(board);
    const hinge = new THREE.Group(); hinge.position.set(-1.5, 0, 0.15); book.add(hinge);
    const innerMat = new THREE.MeshStandardMaterial({ map: makeInner('toc'), roughness: 0.85 });
    const coverMesh = new THREE.Mesh(new THREE.BoxGeometry(3, 4.2, 0.04), [spine, spine, spine, spine, front, innerMat]);
    coverMesh.position.x = 1.5; hinge.add(coverMesh);
    book.userData.hinge = hinge;
    deck = new THREE.Mesh(new THREE.PlaneGeometry(3.3, 2.06), new THREE.MeshStandardMaterial({ map: makeDeck(), roughness: 0.5, side: THREE.DoubleSide }));
    deck.position.set(-1.9, -1.5, -1.4); deck.rotation.set(-0.15, 0.5, 0.1);
    group.add(deck);
    const halo = new THREE.Mesh(new THREE.RingGeometry(3.4, 3.42, 128), new THREE.MeshBasicMaterial({ color: '#C8A96B', transparent: true, opacity: 0.35 }));
    halo.position.z = -1.8; group.add(halo);
    const halo2 = halo.clone(); halo2.scale.setScalar(1.25); halo2.material = halo.material.clone(); halo2.material.opacity = 0.15; group.add(halo2);
    group.userData = { halo, halo2 };
  }

  /* ---- layout ---- */
  const layout = () => {
    const w = el.clientWidth, h = el.clientHeight;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
    if (group) {
      const mobile = w < 900;
      group.userData.base = { x: mobile ? 0 : 4.7, y: mobile ? -7 : 2.9, z: mobile ? -2 : 0.3, mobile };
      group.scale.setScalar(mobile ? 0.62 : 0.95);
    }
  };
  layout(); addEventListener('resize', layout);

  /* ---- interaction ---- */
  const m = { x: 0, y: 0, tx: 0, ty: 0 };
  addEventListener('pointermove', e => { m.tx = (e.clientX / innerWidth) * 2 - 1; m.ty = (e.clientY / innerHeight) * 2 - 1; }, { passive: true });
  const ray = new THREE.Raycaster(), plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 1.2), hit = new THREE.Vector3();
  const state = { scroll: 0, spin: 0, enter: reduce ? 1 : 0 };

  if (window.gsap && window.ScrollTrigger) {
    const host = el.closest('section') || el;
    if (mode !== 'hero') ScrollTrigger.create({ trigger: host, start: 'top top', end: 'bottom top', scrub: true, onUpdate: s => { state.scroll = s.progress; } });
  }
  const introGo = () => {
    if (reduce || !window.gsap) return;
    gsap.to(uniforms.uRise, { value: 1, duration: 3.2, ease: 'expo.out' });
    gsap.fromTo(state, { enter: 0 }, { enter: 1, duration: 2.6, ease: 'expo.out', delay: 0.2 });
    gsap.fromTo(state, { spin: -Math.PI * 1.2 }, { spin: 0, duration: 3, ease: 'expo.out', delay: 0.2 });
  };
  document.addEventListener('artha:intro', introGo, { once: true });
  if (document.documentElement.dataset.introDone) introGo();

  /* ---- loop ---- */
  let visible = true;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(el);
  const clock = new THREE.Clock();
  const tick = () => {
    requestAnimationFrame(tick);
    if (!visible) return;
    const t = clock.getElapsedTime();
    m.x += (m.tx - m.x) * 0.05; m.y += (m.ty - m.y) * 0.05;
    if (mode === 'hero' && window.Artha) state.scroll += ((window.Artha.heroProgress || 0) - state.scroll) * 0.12;
    uniforms.uTime.value = reduce ? 0 : t;
    uniforms.uFlow.value = reduce ? 0 : t * 0.9 + state.scroll * 18;
    ray.setFromCamera({ x: m.x, y: -m.y }, camera);
    if (ray.ray.intersectPlane(plane, hit)) uniforms.uMouse.value.lerp(new THREE.Vector2(hit.x, hit.z), 0.08);

    const push = mode === 'hero' ? 1.2 : 6;
    camera.position.set(camBase.x + m.x * 0.9, camBase.y - m.y * 0.5 + state.scroll * (mode === 'hero' ? 0.6 : 2.2), camBase.z - state.scroll * push);
    camera.lookAt(m.x * 0.6, 1.6 - state.scroll * 1.2, -20);

    if (group) {
      const e = state.enter, B = group.userData.base;
      const open = THREE.MathUtils.smoothstep(state.scroll, 0.12, 0.7);
      book.userData.hinge.rotation.y = -open * 2.5;
      group.position.set(B.x - open * (B.mobile ? 0 : 4.1), B.y + (B.mobile ? open * 8.6 : open * -0.5), B.z - open * (B.mobile ? 0 : 1.5));
      group.rotation.y = -0.45 + m.x * 0.35 + state.spin + open * 0.55;
      group.rotation.x = 0.08 + m.y * 0.18 - open * 0.15;
      group.rotation.z = Math.sin(t * 0.5) * 0.03;
      book.position.y = Math.sin(t * 0.9) * 0.12 + (1 - e) * 6;
      deck.position.y = -1.5 + Math.sin(t * 0.9 + 1.2) * 0.16 + (1 - e) * 8 - open * 3;
      deck.position.x = -1.9 - open * 1.5;
      deck.rotation.y = 0.5 + Math.sin(t * 0.4) * 0.06;
      group.userData.halo.rotation.z = t * 0.1; group.userData.halo2.rotation.z = -t * 0.06;
      group.userData.halo.material.opacity = 0.35 * e; group.userData.halo2.material.opacity = 0.15 * e;
    }
    renderer.render(scene, camera);
  };
  tick();
}

const fontsIn = Promise.race([
  Promise.all(['500 116px Zodiak', 'italic 400 84px Zodiak', '400 26px "General Sans"', '500 30px "JetBrains Mono"'].map(f => document.fonts.load(f).catch(() => {}))),
  new Promise(r => setTimeout(r, 3000)),
]);
fontsIn.then(() => document.querySelectorAll('[data-webgl]').forEach(el => {
  try { mount(el); } catch (err) { console.warn('WebGL unavailable', err); el.classList.add('no-webgl'); }
}));
