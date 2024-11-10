window.addEventListener('load', () => {
    const projectInfo = document.querySelectorAll('.project .container .slider .slide .inner .info');

    const modal = document.querySelector(".modal");
    const modalContent = modal.querySelector(".wrap .content");
    const cancel = modal.querySelector(".wrap > i");

    for(let el of projectInfo) {
        let name = el.getAttribute("data-name");

        el.addEventListener('click', () => {
            getReadme("Dayeong-dev", "Node_Project");
        });
    }

    cancel.addEventListener('click', () => {
        modal.style.display = "none";
    });

    /**
     * Github 해당 레포지토리의 Readme 파일을 불러와 html 형태로 변경 후 modal로 출력하는 함수
     * @param {String} owner 소유자 이름
     * @param {String} repo 레포지토리 명
     */
    async function getReadme(owner, repo) {
        try {
            const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
                headers: { 
                    'X-GitHub-Api-Version': '2022-11-28', 
                    // 'Accept': 'application/vnd.github.v3+json'
                }
            });
            const data = await response.json();
    
            if (data.content) {
                // Base64 디코딩
                const readmeContent = decodeBase64(data.content);

                // Markdown을 HTML로 변환
                const htmlResponse = await fetch('https://api.github.com/markdown', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-GitHub-Api-Version': '2022-11-28',
                        // 'Accept': 'application/vnd.github.v3+json'
                    },
                    body: JSON.stringify({
                        text: readmeContent,
                        // mode: 'gfm', // GitHub Flavored Markdown 형식으로 변환
                        // context: `${owner}/${repo}`
                    })
                });

                let htmlContent = await htmlResponse.text();

                console.log(htmlContent);

                // 줄바꿈 및 링크 관련 html 태그 처리
                htmlContent = htmlContent.replace(/<br>/g, "");
                htmlContent = htmlContent.replace(/\n/g, "<br>");

                modalContent.innerHTML = htmlContent;
            } else {
                modalContent.innerText = "README 파일을 찾을 수 없습니다.";
            }
        } catch (error) {
            console.error("Error fetching README:", error);
            modalContent.innerText = "README를 가져오는 중 오류가 발생했습니다.";
        }
        modal.style.display = "block";
    }

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