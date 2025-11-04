import { modalElements } from "../dom/domElements.js";
import { addScrollEvent, removeScrollEvent } from "./scroll.js";

/**
 * 모달을 여는 함수
 * @param {String} owner 깃허브 소유자
 * @param {String} repo 깃허브 레포지토리 명
 */
const openModal = (owner, repo, url = null) => {
    removeScrollEvent();    // 스크롤 이벤트 중단

    const spinner = modalElements.spinner;
    const modal = modalElements.modal;
    const modalContent = modalElements.modalContent;
    const footer = modalElements.footer;

    spinner.style.display = "block";

    // 해당 레포지토리의 README 데이터를 조회
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

        // 마크다운 데이터를 HTML 형식으로 변환
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
            htmlContent = htmlContent.replace(/href="/g, `href="https://raw.githubusercontent.com/${owner}/${repo}/main/`);
            htmlContent = htmlContent.replace(/src="/g, `src="https://raw.githubusercontent.com/${owner}/${repo}/main/`);
            htmlContent = htmlContent.replace(/<a/g, "<a target='_blank'"); // a 태그 클릭 시, 새 탭에서 해당 링크 연결
            modalContent.innerHTML = htmlContent;

            spinner.style.display = "none";
        })
        .catch(error => {
            console.error("README 데이터를 HTML 형식으로 변환 중 오류 발생:", error);
            modalContent.innerText = "README 데이터를 HTML 형식으로 변환 중 오류가 발생했습니다.";

            spinner.style.display = "none";
        });

        // 모달 footer 세팅
        footer.innerHTML = "";      // 초기화
        if(url !== null) {
                    

            footer.innerHTML += `<a href="${url}" class="button" target="_blank"><i class="fa-solid fa-arrow-up-right-from-square"></i>Visit site</a>`;
        }
        footer.innerHTML += `<a href="https://github.com/${owner}/${repo}" class="button" target="_blank"><i class="fa-brands fa-github"></i>Github</a>`;
    })
    .catch(error => {
        console.error("README 데이터를 가져오는 중 오류 발생:", error);
        modalContent.innerText = "README 데이터를 가져오는 중 오류가 발생했습니다.";
        
        spinner.style.display = "none";
    })
    .finally(() => {
        modal.style.display = "block";
    });
}

/**
 * 모달을 닫는 함수
 */
const closeModal = () => {
    const modal = modalElements.modal;
    const modalContent = modalElements.modalContent;

    modal.style.display = "none";
    modalContent.innerHTML = "";

    addScrollEvent();  // 스크롤 이벤트 재시작
}

/**
 * Base64를 UTF-8로 디코딩하는 함수
 * @param {String} base64 Base64로 인코딩된 값(문자열)
 * @returns UTF-8로 디코딩된 값(문자열)
 */
const decodeBase64 = (base64) => {
    const binaryString = atob(base64);
    const binaryLen = binaryString.length;
    const bytes = new Uint8Array(binaryLen);

    for (let i = 0; i < binaryLen; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    const decoder = new TextDecoder('utf-8');
    return decoder.decode(bytes);
}

const initializeModal = () => {
    const projectImageWrappers = modalElements.projectImageWrappers;
    const cancel = modalElements.cancel;

    for(let el of projectImageWrappers) {
        let name = el.getAttribute("data-name");
        let url = el.getAttribute("data-url");

        const owner = "Dayeong-dev";    // GitHub 소유자 이름
        const repo = name;   // GitHub 레포지토리 명

        el.addEventListener('click', () => openModal(owner, repo, url));
    }
    cancel.addEventListener('click', closeModal);
}

export {initializeModal, openModal, closeModal};