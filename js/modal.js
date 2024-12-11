import {initScrollEvent, removeScrollEvent} from './scroll.js';

window.addEventListener('load', () => {
    const projectInfo = document.querySelectorAll('.project .container .slider .slide .inner .info');

    const modal = document.querySelector(".modal");
    const modalContent = modal.querySelector(".wrap .content");
    const cancel = modal.querySelector(".wrap > i");
    const spinner = modalContent.querySelector("i.fa-spinner");

    for(let el of projectInfo) {
        let name = el.getAttribute("data-name");

        const owner = "Dayeong-dev";    // GitHub 소유자 이름
        const repo = name;   // GitHub 레포지토리 명

        el.addEventListener('click', () => {
            removeScrollEvent();
            spinner.style.display = "block";

            // Get a repository README
            fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
                method: 'GET',
                headers: { 
                    'Accept': 'application/vnd.github.v3+json',
                    'X-GitHub-Api-Version': '2022-11-28', 
                }
            })
            .then(response => response.json())
            .then(data => {
                // Base64 디코딩
                const readmeContent = decodeBase64(data.content);

                // Render a Markdown document
                fetch('https://api.github.com/markdown', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/vnd.github.v3+json',
                        'Content-Type': 'application/json',
                        'X-GitHub-Api-Version': '2022-11-28',
                    },
                    body: JSON.stringify({
                        text: readmeContent,
                        mode: 'gfm', // GitHub Flavored Markdown 형식으로 변환
                        context: `${owner}/${repo}`
                    })
                })
                .then(htmlResponse => htmlResponse.text())
                .then(htmlContent => {
                    // README 내의 링크 클릭 시, 새 탭에서 해당 링크 연결
                    htmlContent = htmlContent.replace(/<a/g, "<a target='_blank'");
                    modalContent.innerHTML = htmlContent;

                    spinner.style.display = "none";
                })
                .catch(error => {
                    console.error("README 데이터를 HTML 형식으로 변환 중 오류 발생:", error);
                    modalContent.innerText = "README 데이터를 HTML 형식으로 변환 중 오류가 발생했습니다.";

                    spinner.style.display = "none";
                });
            })
            .catch(error => {
                console.error("README 데이터를 가져오는 중 오류 발생:", error);
                modalContent.innerText = "README 데이터를 가져오는 중 오류가 발생했습니다.";
                
                spinner.style.display = "none";
            })
            .finally(() => {
                modal.style.display = "block";
            });
        });
    }

    cancel.addEventListener('click', () => {
        initScrollEvent();
        modal.style.display = "none";
    });

    /**
    * Base64를 UTF-8로 디코딩하는 함수
    * @param {String} base64 Base64로 인코딩된 값(문자열)
    * @returns UTF-8로 디코딩된 값(문자열)
    */
    function decodeBase64(base64) {
        const binaryString = atob(base64);
        const binaryLen = binaryString.length;
        const bytes = new Uint8Array(binaryLen);

        for (let i = 0; i < binaryLen; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        const decoder = new TextDecoder('utf-8');
        return decoder.decode(bytes);
    }
});