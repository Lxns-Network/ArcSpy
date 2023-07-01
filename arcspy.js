// ==UserScript==
// @name         ArcSpy for LxBot
// @namespace    https://github.com/Lxns-Network/ArcSpy
// @version      0.1
// @description  A tool for Arcaea player to crawl their score data, and upload it to LxBot server.
// @author       Lxns Network
// @match        https://arcaea.lowiro.com/*/profile/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lowiro.com
// @homepage     https://github.com/Lxns-Network/ArcSpy
// @homepageURL  https://github.com/Lxns-Network/ArcSpy
// @downloadURL  https://github.com/Lxns-Network/ArcSpy/raw/main/arcspy.js
// @updateURL    https://github.com/Lxns-Network/ArcSpy/raw/main/arcspy.js
// @supportURL   https://github.com/Lxns-Network/ArcSpy/issues
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      raw.githubusercontent.com
// @connect      webapi.lowiro.com
// @connect      *
// ==/UserScript==

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class Modal {
    constructor() {
        this.modalTitle = null;
        this.modalBody = null;
        this.modalMask = null;

        this.modalDataAttribute = null;

        this._initModalDataAttribute();
    };

    createTitleModal(content) {
        const modalTitle = document.createElement('h1');

        modalTitle.setAttribute('data-v-130d372e', '');
        modalTitle.setAttribute(this.modalDataAttribute, '');
        modalTitle.classList.add('modal-playersite', 'modal-title');
        modalTitle.style.fontSize = '28px';
        modalTitle.textContent = content;

        return modalTitle;
    };

    _initModalDataAttribute() {
        document.styleSheets.forEach((sheet, i) => {
            if (sheet.href === null) {
                return;
            }
            if (sheet.href.indexOf("index") !== -1) {
                sheet.rules.forEach((rule, j) => {
                    if (rule.selectorText === null) {
                        return;
                    }
                    if (rule.selectorText.indexOf(".modal-wrapper") !== -1) {
                        this.modalDataAttribute = rule.selectorText.replace(/\.modal-wrapper\[(.+)\]/, "$1");
                    }
                });
            }
        });
    };

    createInputModal() {
        const inputModal = document.createElement('input');

        inputModal.setAttribute('type', 'text');
        inputModal.classList.add('input-modal-playersite');
        inputModal.style.fontSize = "14px";
        inputModal.style.backgroundColor = "#f8f8f8";
        inputModal.style.border = "1px solid #e2e2e2";
        inputModal.style.width = "90%";
        inputModal.style.boxSizing = "border-box";
        inputModal.style.padding = "18px 12px";
        inputModal.style.borderRadius = "1px";
        inputModal.style.margin = "10px 0";

        return inputModal;
    };

    createSelectModal() {
        const selectModal = document.createElement('select');

        selectModal.style.fontSize = "14px";
        selectModal.style.backgroundColor = "#f8f8f8";
        selectModal.style.border = "1px solid #e2e2e2";
        selectModal.style.width = "90%";
        selectModal.style.boxSizing = "border-box";
        selectModal.style.padding = "18px 12px";
        selectModal.style.borderRadius = "1px";
        selectModal.style.margin = "10px 0";

        return selectModal;
    };

    createSpanModal(content, align='left') {
        const span = document.createElement('span');

        span.style.width = '90%';
        span.style.textAlign = align;
        // span.style.fontWeight = 'bold';
        span.innerHTML = content;

        return span;
    };

    createBtnModal(content, theme='dark') {
        const btnModal = document.createElement('div');

        btnModal.setAttribute('data-v-60945ec8', '');
        btnModal.setAttribute('data-v-130d372e', '');
        btnModal.classList.add('btn-modal', theme);
        btnModal.setAttribute(this.modalDataAttribute, '');
        btnModal.textContent = content;

        return btnModal;
    };

    getInitializedBodyModal() {
        const bodyModal = document.createElement('div');

        bodyModal.setAttribute('data-v-130d372e', '');
        bodyModal.setAttribute(this.modalDataAttribute, '');
        bodyModal.style.display = "flex";
        bodyModal.style.flexDirection = "column";
        bodyModal.style.alignItems = "center";
        bodyModal.classList.add('body-modal');

        return bodyModal;
    };

    getInitializedModalAction() {
        const modalAction = document.createElement('div');

        modalAction.setAttribute(this.modalDataAttribute, '');
        modalAction.classList.add('modal-action');

        return modalAction;
    };

    getInitializedModalBody() {
        const modalBody = document.createElement('div');

        modalBody.setAttribute(this.modalDataAttribute, '');
        modalBody.classList.add('modal-body');

        return modalBody;
    };

    _setModalBody(body) {
        body.setAttribute(this.modalDataAttribute, '');
        body.classList.add('modal-body');

        return body;
    };

    setModalBody(title, body) {
        this.modalTitle = title;
        this.modalBody = body;

        const modalTitleElement = this.modalMask.querySelector('.modal-title');
        modalTitleElement.textContent = title;

        const modalBodyElement = this.modalMask.querySelector('.modal-body');
        modalBodyElement.innerHTML = ''; // clear the current body
        modalBodyElement.appendChild(body); // add the new body
    };

    closeModal() {
        this.modalBody = null;
        let _modalMask = document.getElementsByTagName("section")[0].childNodes[0];
        _modalMask.style.transform = "scale(1.1)";
        _modalMask.style.opacity = 0;
        sleep(300).then(() => {
            _modalMask.remove();
        });
    };

    createModal(title, body) {
        this.modalTitle = title;
        this.modalBody = body;

        this.modalMask = document.createElement('div');
        this.modalMask.setAttribute(this.modalDataAttribute, '');
        this.modalMask.setAttribute('data-v-130d372e', '');
        this.modalMask.style.opacity = 0;
        this.modalMask.style.transition = 'all .3s';
        this.modalMask.classList.add('modal-mask');

        const modalWrapper = document.createElement('div');
        modalWrapper.setAttribute(this.modalDataAttribute, '');
        modalWrapper.classList.add('modal-wrapper');

        const modalContainer = document.createElement('div');
        modalContainer.setAttribute(this.modalDataAttribute, '');
        modalContainer.style.paddingBottom = "20px";
        modalContainer.style.overflow = "auto";
        modalContainer.classList.add('modal-container');

        const closeButton = document.createElement('i');
        closeButton.setAttribute(this.modalDataAttribute, '');
        closeButton.classList.add('close');
        closeButton.textContent = '✕';
        closeButton.addEventListener('click', () => {this.closeModal()});
        modalContainer.appendChild(closeButton);

        const modalHeader = document.createElement('div');
        modalHeader.setAttribute(this.modalDataAttribute, '');
        modalHeader.classList.add('modal-header');

        const modalTitle = this.createTitleModal(this.modalTitle);
        modalHeader.appendChild(modalTitle);

        modalContainer.appendChild(modalHeader);

        const hr = document.createElement('hr');
        hr.setAttribute(this.modalDataAttribute, '');
        hr.classList.add('top');
        modalContainer.appendChild(hr);

        const modalBody = document.createElement('div');
        modalBody.setAttribute(this.modalDataAttribute, '');
        modalBody.classList.add('modal-body');

        const bodyModal = this.modalBody;
        modalBody.appendChild(bodyModal);

        modalContainer.appendChild(modalBody);

        modalWrapper.appendChild(modalContainer);
        this.modalMask.appendChild(modalWrapper);

        const section = document.getElementsByTagName("section")[0];
        this.modalMask.style.transform = 'scale(1.1)';
        this.modalMask.style.opacity = 0;
        section.prepend(this.modalMask);

        sleep(1).then(() => {
            let _modalMask = document.getElementsByTagName("section")[0].childNodes[0];
            _modalMask.style.transform = "scale(1)";
            _modalMask.style.opacity = 1;
        });
    };
}

(() => {
    'use strict';

    const LOGO = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3NpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDYuMC1jMDAzIDc5LjE2NDUyNywgMjAyMC8xMC8xNS0xNzo0ODozMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo1ZjJhNzhkNi1lZmM3LTUzNGItODA3Ny1mYjllMTJlMzUwOGIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QUM5NTREN0RFRTA4MTFFQjkwMkNDRjEyQzg5QkE1MkUiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QUM5NTREN0NFRTA4MTFFQjkwMkNDRjEyQzg5QkE1MkUiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIyLjEgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NWYyYTc4ZDYtZWZjNy01MzRiLTgwNzctZmI5ZTEyZTM1MDhiIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjVmMmE3OGQ2LWVmYzctNTM0Yi04MDc3LWZiOWUxMmUzNTA4YiIvPiA8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";
    const BOUNDARY = "----WebKitFormBoundary7MA4YWxkTrZu0gW";
    const DIFFICULTY_NAME = ["PST", "PRS", "FTR", "BYD"];

    const arcSpyModal = new Modal();

    let intervalId;

    /*
    缓存相关
    */
    let songList;

    /*
    配置文件相关
    */
    let songListUrl = GM_getValue("songListUrl");
    let scoreQueryInterval = GM_getValue("scoreQueryInterval");
    let saveCookie = GM_getValue("saveCookie");
    let maxScoreCount = GM_getValue("maxScoreCount");

    function parseQueryString(queryString) {
        const params = {};
        const queries = queryString.split("&");

        for (let i = 0; i < queries.length; i++) {
            const keyValue = queries[i].split("=");
            const key = decodeURIComponent(keyValue[0]);
            const value = decodeURIComponent(keyValue[1] || "");
            params[key] = value;
        }

        return params;
    }

    function syncSongList(force=false) {
        let songListUrl = GM_getValue("songListUrl");

        if (songList === undefined || force) {
            console.log("正在同步曲目列表...");

            GM_xmlhttpRequest({
                method: "GET",
                url: songListUrl,
                onload: (responseDetails) => {
                    let response = JSON.parse(responseDetails.responseText);
                    songList = response;
                    localStorage.setItem("songList", JSON.stringify(response));
                }
            });
        }
    }

    function calcPotential(score=0, songRatingFloat=0) {
        let potential;
        if (score > 10000000) {
            potential = songRatingFloat + 2.0;
        } else if (score > 9800000) {
            potential = songRatingFloat + 1.0 + (score - 9800000) / 200000;
        } else {
            potential = Math.max(songRatingFloat + (score - 9500000) / 300000, 0);
        }
        return potential;
    }

    function getSortedSongRatingList(testSongList) {
        let _songList = songList;

        if (testSongList !== undefined) {
            _songList = testSongList;
        }

        const songRatingList = {};

        _songList.songs.forEach(({ song_id, difficulties }) => {
            songRatingList[song_id] = difficulties.flatMap(({ rating }) => rating);
        });

        return Object.entries(songRatingList)
        .flatMap(([key, value]) => value.map((v, i) => ({ key, value: v, index: i })))
        .sort((a, b) => b.value - a.value);
    }

    /*
    获取成绩
    */
    function getPlayerScores(friendCode, isSelf=false) {
        const start = performance.now();

        const cachedPlayer = getCachedPlayers().find(user => user.user_code === friendCode);
        if (cachedPlayer === undefined) {
            alert("未在缓存中找到目标账号，请确认是否登录过目标账号并使用“缓存用户详情”功能");
            return [];
        }
        const userId = cachedPlayer.user_id;

        let scores = [];
        const sortedSongRatingList = getSortedSongRatingList();

        const processText = document.getElementById("arcspy-process-text");

        let endpoint = "score/song/friend";
        if (isSelf) {
            endpoint = "score/song/me";
        }

        // 开始遍历定数，从大至小进行查询
        let index = 0;
        intervalId = setInterval(() => {
            if (index >= sortedSongRatingList.length) {
                const end = performance.now();
                clearInterval(intervalId);
                if (scores.length !== 0) {
                    processText.textContent = `爬取了 ${scores.length} 个成绩，耗时 ${((end - start) / 1000).toFixed()} 秒`;
                    document.getElementById("arcspy-upload-button").style.display = "flex";
                    document.getElementById("arcspy-back-button").style.display = "flex";
                    document.getElementById("arcspy-interrupt-button").style.display = "none";
                    savePlayerScores(userId, scores);
                    return scores;
                } else {
                    processText.textContent = `未爬取到任何成绩，耗时 ${((end - start) / 1000).toFixed()} 秒`;
                    alert("查询了所有曲目，但未获取到任何成绩，可能是因为目标账号的排行榜被封禁");
                    document.getElementById("arcspy-back-button").style.display = "flex";
                    document.getElementById("arcspy-interrupt-button").style.display = "none";
                    return [];
                }
            }

            const song = sortedSongRatingList[index++];

            processText.textContent = `正在查询曲目 ${song.key} [${DIFFICULTY_NAME[song.index]}]...`;
            requestAPI('GET', `${endpoint}?song_id=${song.key}&difficulty=${song.index}&start=0&limit=30`).then((response) => {
                if (!response.success) {
                    clearInterval(intervalId);
                    alert(`曲目 ${song.key} [${DIFFICULTY_NAME[song.index]}] 获取失败，错误码：${response.error_code}`);
                    openScoreQueryModal();
                    return;
                }
                if (scores.length >= maxScoreCount) {
                    scores.sort((a, b) => b.rating - a.rating);
                    scores = scores.slice(0, 40);
                    let songMaxRating = song.value / 10 + 2;
                    let playerMinRating = scores[scores.length - 1].rating;
                    if (songMaxRating - playerMinRating <= 2) {
                        let percent = (100 - (songMaxRating - playerMinRating) / 2 * (100 - (index / sortedSongRatingList.length) * 100)) / 100;
                        if (songMaxRating < playerMinRating) {
                            const end = performance.now();
                            processText.textContent = `爬取 Best ${maxScoreCount} 成绩完成，耗时 ${((end - start) / 1000).toFixed()} 秒`;
                            percent = 1;
                            document.getElementById("arcspy-upload-button").style.display = "flex";
                            document.getElementById("arcspy-back-button").style.display = "flex";
                            document.getElementById("arcspy-interrupt-button").style.display = "none";
                        }
                        applyProcessPercentage(percent);
                    }
                    if (songMaxRating < playerMinRating) {
                        console.log(scores);
                        savePlayerScores(userId, scores);
                        clearInterval(intervalId);
                        return scores;
                    }
                } else {
                    applyProcessPercentage(index / sortedSongRatingList.length);
                }
                response.value.forEach((player, j) => {
                    if (player.user_id === userId) {
                        player.rating = calcPotential(player.score, song.value / 10);
                        console.log(player);
                        scores.push(player);
                    }
                });
            }).catch((error) => {
                console.error(error);
            });
        }, scoreQueryInterval);
    }

    function savePlayerScores(userId, scores) {
        let cachedScores = localStorage.getItem("scores");

        if (cachedScores === null) {
            cachedScores = {};
        } else {
            cachedScores = JSON.parse(cachedScores);
        }

        cachedScores[userId] = scores;

        localStorage.setItem("scores", JSON.stringify(cachedScores));
        return cachedScores;
    }

    function requestAPI(method, endpoint, data) {
        let headers = null;
        let formData = null;

        if (method === "POST") {
            let params = parseQueryString(data);

            headers = {
                "Content-Type": `multipart/form-data; boundary=${BOUNDARY}`
            };
            formData = "";

            for (const key in params) {
                formData += `--${BOUNDARY}\r\nContent-Disposition: form-data; name="${key}"\r\n\r\n${params[key]}\r\n`;
            }

            formData += `--${BOUNDARY}--\r\n`;
        }

        return new Promise((resolve, reject) => {
            console.log(`> https://webapi.lowiro.com/webapi/${endpoint}`);
            GM_xmlhttpRequest({
                method: method,
                url: `https://webapi.lowiro.com/webapi/${endpoint}`,
                data: formData,
                headers: headers,
                onload: (responseDetails) => {
                    const response = JSON.parse(responseDetails.responseText);
                    console.log(response);
                    if (saveCookie && endpoint === "user/me") {
                        const sessionId = responseDetails.responseHeaders.match(/sid=(.+?);/)[1];
                        savePlayerCookie(response.value.user_id, sessionId);
                    }
                    resolve(response);
                },
                onerror: (error) => reject(error)
            });
        });
    }

    function validateSongListUrl(testSongListUrl) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: testSongListUrl,
                onload: (responseDetails) => {
                    try {
                        const testSongList = JSON.parse(responseDetails.responseText);
                        const sortedSongRatingList = getSortedSongRatingList(testSongList);
                        resolve(true);
                    } catch (error) {
                        resolve(false);
                    }
                },
                onerror: (error) => resolve(false)
            });
        });
    }

    function applyProcessPercentage(percent) {
        const processPercentageModal = document.getElementById("arcspy-process-percentage");
        processPercentageModal.textContent = `${(percent * 100).toFixed(1)}%`;

        const processBarFill = document.getElementById("arcspy-process-bar-fill");
        processBarFill.style.width = `${(0.9 * percent) * 100}%`;
    }

    /*
    成绩爬取进度窗口
    */
    function openQueryProcessModal() {
        const modalBody = arcSpyModal.getInitializedModalBody();

        const bodyModal = arcSpyModal.getInitializedBodyModal();

        const processText = arcSpyModal.createSpanModal('准备中...');
        processText.setAttribute("id", "arcspy-process-text");
        bodyModal.appendChild(processText);

        const processPercentageModal = arcSpyModal.createSpanModal('0%', 'right');
        processPercentageModal.setAttribute("id", "arcspy-process-percentage");
        processPercentageModal.style.position = "absolute";
        processPercentageModal.style.width = "72.6%";
        bodyModal.appendChild(processPercentageModal);

        const processBar = document.createElement("div");
        processBar.style.height = "10px";
        processBar.style.width = "90%";
        processBar.style.backgroundColor = "#b0a9c7";
        processBar.style.borderRadius = "2px";

        const processBarFill = document.createElement("div");
        processBarFill.setAttribute("id", "arcspy-process-bar-fill");
        processBarFill.style.height = "10px";
        processBarFill.style.width = "0";
        processBarFill.style.backgroundColor = "#7acaec";
        processBarFill.style.marginTop = "-10px";
        processBarFill.style.borderRadius = "2px";
        processBarFill.style.transition = `${scoreQueryInterval / 1000}s width`;

        bodyModal.appendChild(processBar);
        bodyModal.appendChild(processBarFill);

        const modalAction = arcSpyModal.getInitializedModalAction();

        const interruptBtnModal = arcSpyModal.createBtnModal('中断', 'light');
        interruptBtnModal.setAttribute("id", "arcspy-interrupt-button");
        interruptBtnModal.addEventListener('click', () => {
            clearInterval(intervalId);
            alert("已中断爬取进程。");
            openScoreQueryModal();
        });
        modalAction.appendChild(interruptBtnModal);

        const uploadBtnModal = arcSpyModal.createBtnModal('上传到 LxBot', 'light');
        uploadBtnModal.setAttribute("id", "arcspy-upload-button");
        uploadBtnModal.style.display = "none";
        uploadBtnModal.addEventListener('click', openUploadModal);
        modalAction.appendChild(uploadBtnModal);

        const backBtnModal = arcSpyModal.createBtnModal('返回', 'light');
        backBtnModal.setAttribute("id", "arcspy-back-button");
        backBtnModal.style.display = "none";
        backBtnModal.addEventListener('click', () => {
            openScoreQueryModal();
        });
        modalAction.appendChild(backBtnModal);

        modalBody.appendChild(bodyModal);
        modalBody.appendChild(modalAction);

        arcSpyModal.setModalBody('爬取成绩', modalBody);
    }

    /*
    成绩查询窗口
    */
    function openScoreQueryModal() {
        const modalBody = arcSpyModal.getInitializedModalBody();

        const bodyModal = arcSpyModal.getInitializedBodyModal();

        bodyModal.appendChild(arcSpyModal.createSpanModal('请选择目标爬取账号：'));

        const players = getCachedPlayers();
        const playerSelectModal = arcSpyModal.createSelectModal();
        playerSelectModal.setAttribute("id", "arcspy-player-select");
        playerSelectModal.addEventListener("change", () => {
            document.getElementById("arcspy-start-button").classList.remove("disabled");
        });
        players.forEach((player, i) => {
            let option = document.createElement("option");
            option.value = player.user_id;
            option.text = player.display_name;
            playerSelectModal.appendChild(option);
        });
        bodyModal.appendChild(playerSelectModal);

        bodyModal.appendChild(arcSpyModal.createSpanModal('注意：开始爬取前你需要登录目标爬取账号，并使用“缓存用户详情”功能才能操作。'));

        const modalAction = arcSpyModal.getInitializedModalAction();

        const startBtnModal = arcSpyModal.createBtnModal('开始爬取');
        startBtnModal.setAttribute("id", "arcspy-start-button")
        startBtnModal.addEventListener('click', () => {
            document.getElementById("arcspy-start-button").classList.add("disabled");

            const player = getCachedPlayers().find(user => user.user_id === parseInt(playerSelectModal.value))
            const friendCode = player.user_code;

            requestAPI('GET', 'user/me').then((response) => {
                if (!response.success) {
                    alert("用户详情获取失败，错误码：" + response.error_code);
                    return;
                }
                if (response.value.user_code !== friendCode && Date.now() - response.value.arcaea_online_expire_ts > 0) {
                    alert("受官方接口限制，您需要订阅 Arcaea Online 才能查询其他账号。");
                    return;
                }
                return requestAddFriend(friendCode);
            }).then((response) => {
                let useSongMeAPI = false;
                if (!response.success) {
                    if (response.error_code === 604) {
                        if (!confirm("警告！您正在尝试查询您现在登录的账号，“确定”以继续查询。")) {
                            return;
                        }
                        useSongMeAPI = true;
                    } else if (response.error_code === 401) {
                        alert("玩家不存在。");
                        return;
                    } else if (response.error_code !== 602) {
                        alert("好友添加失败，错误码：" + response.error_code);
                        return;
                    }
                }
                openQueryProcessModal();
                getPlayerScores(friendCode, useSongMeAPI);
            }).catch((error) => {
                console.error(error);
            });
        });
        modalAction.appendChild(startBtnModal);

        const backBtnModal = arcSpyModal.createBtnModal('返回', 'light');
        backBtnModal.addEventListener('click', openMainModal);
        modalAction.appendChild(backBtnModal);

        modalBody.appendChild(bodyModal);
        modalBody.appendChild(modalAction);

        arcSpyModal.setModalBody('爬取成绩', modalBody);
    }

    /*
    脚本设置窗口
    */
    function openOptionModal() {
        const modalBody = arcSpyModal.getInitializedModalBody();

        const bodyModal = arcSpyModal.getInitializedBodyModal();

        bodyModal.appendChild(arcSpyModal.createSpanModal('曲目列表同步来源：'));

        const songListUrlInputModal = arcSpyModal.createInputModal();
        songListUrlInputModal.value = songListUrl;
        songListUrlInputModal.addEventListener('input', () => {
            document.getElementById("arcspy-save-button").classList.remove('disabled');
        });
        bodyModal.appendChild(songListUrlInputModal);

        bodyModal.appendChild(arcSpyModal.createSpanModal('爬取单个成绩的间隔时间（单位为毫秒）：'));

        const scoreQueryIntervalInputModal = arcSpyModal.createInputModal();
        scoreQueryIntervalInputModal.value = scoreQueryInterval;
        scoreQueryIntervalInputModal.addEventListener('input', () => {
            document.getElementById("arcspy-save-button").classList.remove('disabled');
        });
        bodyModal.appendChild(scoreQueryIntervalInputModal);

        bodyModal.appendChild(arcSpyModal.createSpanModal('缓存用户时是否包含<b>敏感</b> Cookie 信息（仅用户凭据）：'));

        const saveCookieInputModal = arcSpyModal.createInputModal();
        saveCookieInputModal.setAttribute('id', 'arcspy-save-cookie-input');
        saveCookieInputModal.setAttribute('type', 'checkbox');
        saveCookieInputModal.checked = saveCookie;
        saveCookieInputModal.addEventListener('click', () => {
            document.getElementById("arcspy-save-button").classList.remove('disabled');
        });
        bodyModal.appendChild(saveCookieInputModal);

        bodyModal.appendChild(arcSpyModal.createSpanModal('勾选后若缓存数据包含用户凭据将会一并上传，以便 LxBot 查询单曲成绩。'));

        const modalAction = arcSpyModal.getInitializedModalAction();

        const saveBtnModal = arcSpyModal.createBtnModal('保存');
        saveBtnModal.classList.add('disabled');
        saveBtnModal.setAttribute('id', 'arcspy-save-button');
        saveBtnModal.addEventListener('click', () => {
            validateSongListUrl(songListUrlInputModal.value).then((isLegalSongListUrl) => {
                if (!isLegalSongListUrl) {
                    alert("保存失败，不是合法的曲目列表文件。");
                    return;
                } else {
                    scoreQueryInterval = parseInt(scoreQueryIntervalInputModal.value);
                    GM_setValue("scoreQueryInterval", scoreQueryInterval);
                }
            });

            if (parseInt(scoreQueryIntervalInputModal.value) === NaN) {
                alert("保存失败，请输入有效的爬取间隔时间。");
            } else {
                scoreQueryInterval = parseInt(scoreQueryIntervalInputModal.value);
                GM_setValue("scoreQueryInterval", scoreQueryInterval);
            }

            saveCookie = document.getElementById("arcspy-save-cookie-input").checked;
            GM_setValue("saveCookie", saveCookie);

            document.getElementById("arcspy-save-button").classList.add('disabled');
        });
        modalAction.appendChild(saveBtnModal);

        const resetBtnModal = arcSpyModal.createBtnModal('恢复默认设置', 'light');
        resetBtnModal.addEventListener('click', () => {
            setDefaultConfig(true);
            openOptionModal();
        });
        modalAction.appendChild(resetBtnModal);

        const backBtnModal = arcSpyModal.createBtnModal('返回', 'light');
        backBtnModal.addEventListener('click', openMainModal);
        modalAction.appendChild(backBtnModal);

        modalBody.appendChild(bodyModal);
        modalBody.appendChild(modalAction);

        arcSpyModal.setModalBody('ArcSpy 设置', modalBody);
    }

    /*
    上传窗口
    */
    function openUploadModal() {
        const modalBody = arcSpyModal.getInitializedModalBody();

        const bodyModal = arcSpyModal.getInitializedBodyModal();

        bodyModal.appendChild(arcSpyModal.createSpanModal('请选择需要上传的玩家数据：'));

        const players = getCachedPlayers();
        const playerSelectModal = arcSpyModal.createSelectModal();
        playerSelectModal.setAttribute("id", "arcspy-player-select");
        players.forEach((player, i) => {
            let option = document.createElement("option");
            option.value = player.user_id;
            option.text = player.display_name;
            playerSelectModal.appendChild(option);
        });
        bodyModal.appendChild(playerSelectModal);

        bodyModal.appendChild(arcSpyModal.createSpanModal('将会上传缓存的玩家信息、爬取的 Best 成绩，以及可选的 Cookie 信息（仅用户凭据）。'));

        const modalAction = arcSpyModal.getInitializedModalAction();

        const uploadBtnModal = arcSpyModal.createBtnModal('开始上传');
        uploadBtnModal.setAttribute('id', 'arcspy-upload-button');
        uploadBtnModal.addEventListener('click', () => {
            //document.getElementById("arcspy-upload-button").classList.add('disabled');

            const playerSelectModal = document.getElementById("arcspy-player-select");
            const player = getCachedPlayers().find(user => user.user_id === parseInt(playerSelectModal.value));

            const cachedScores = JSON.parse(localStorage.getItem("scores"));

            if (cachedScores === null || cachedScores[player.user_id] === undefined) {
                alert("没有找到该玩家的成绩数据，请先使用“爬取成绩”功能保存。");
                return;
            }

            const uploadData = {
                player: player,
                scores: cachedScores[player.user_id],
            };

            console.log(uploadData);
        });
        modalAction.appendChild(uploadBtnModal);

        const backBtnModal = arcSpyModal.createBtnModal('返回', 'light');
        backBtnModal.addEventListener('click', openMainModal);
        modalAction.appendChild(backBtnModal);

        modalBody.appendChild(bodyModal);
        modalBody.appendChild(modalAction);

        arcSpyModal.setModalBody('上传至 LxBot', modalBody);
    }

    /*
    关于窗口
    */
    function openAboutModal() {
        const modalBody = arcSpyModal.getInitializedModalBody();

        const bodyModal = arcSpyModal.getInitializedBodyModal();

        bodyModal.appendChild(arcSpyModal.createSpanModal('ArcSpy 是由 Lxns Network 制作的一个爬虫工具，用于用户缓存自己的玩家数据，使用小号爬取 Best 成绩并上传至 LxBot。'));
        bodyModal.appendChild(arcSpyModal.createSpanModal("使用该工具，代表您已知晓您违反了 Arcaea 的<a href='https://arcaea.lowiro.com/zh/terms_of_service'><b>服务条款</b></a>，并且了解该工具有一定风险会导致账号被<b>封禁</b>。"));
        bodyModal.appendChild(arcSpyModal.createSpanModal("我们只建议您使用小号来查询其他账号，我们对您使用该工具造成的任何损失不予以承担任何责任。"));

        const modalAction = arcSpyModal.getInitializedModalAction();

        const checkUpdateBtnModal = arcSpyModal.createBtnModal('检查更新', 'light');
        checkUpdateBtnModal.addEventListener('click', () => {
            alert("暂不支持。");
        });
        modalAction.appendChild(checkUpdateBtnModal);

        const resetBtnModal = arcSpyModal.createBtnModal('清空 ArcSpy 数据', 'light');
        resetBtnModal.style.color = "red";
        resetBtnModal.addEventListener('click', () => {
            localStorage.clear();
            alert("已清空所有数据。");
            arcSpyModal.closeModal();
        });
        modalAction.appendChild(resetBtnModal);

        const backBtnModal = arcSpyModal.createBtnModal('返回', 'light');
        backBtnModal.addEventListener('click', openMainModal);
        modalAction.appendChild(backBtnModal);

        modalBody.appendChild(bodyModal);
        modalBody.appendChild(modalAction);

        arcSpyModal.setModalBody('关于 ArcSpy', modalBody);
    }

    /*
    主窗口
    */
    function openMainModal() {
        const modalBody = arcSpyModal.getInitializedModalBody();

        const bodyModal = arcSpyModal.getInitializedBodyModal();

        bodyModal.appendChild(arcSpyModal.createSpanModal('请选择要进行的操作', 'center'));

        const modalAction = arcSpyModal.getInitializedModalAction();

        const saveBtnModal = arcSpyModal.createBtnModal('缓存用户详情');
        saveBtnModal.addEventListener('click', () => {
            saveBtnModal.classList.add('disabled');
            requestAPI('GET', 'user/me').then((response) => {
                if (!response.success) {
                    alert("用户详情获取失败，错误码：" + response.error_code);
                    return;
                }
                savePlayerInfo(response.value);
                alert(`玩家 ${response.value.name} 缓存成功。`);
                saveBtnModal.classList.remove('disabled');
            }).catch((error) => {
                console.error(error);
            });
        });
        modalAction.appendChild(saveBtnModal);

        const scoreQueryBtnModal = arcSpyModal.createBtnModal('爬取成绩');
        scoreQueryBtnModal.addEventListener('click', openScoreQueryModal);
        modalAction.appendChild(scoreQueryBtnModal);

        const uploadBtnModal = arcSpyModal.createBtnModal('上传至 LxBot');
        uploadBtnModal.addEventListener('click', openUploadModal);
        modalAction.appendChild(uploadBtnModal);

        const optionBtnModal = arcSpyModal.createBtnModal('ArcSpy 设置');
        optionBtnModal.addEventListener('click', openOptionModal);
        modalAction.appendChild(optionBtnModal);

        const aboutBtnModal = arcSpyModal.createBtnModal('关于 ArcSpy');
        aboutBtnModal.addEventListener('click', openAboutModal);
        modalAction.appendChild(aboutBtnModal);

        modalBody.appendChild(bodyModal);
        modalBody.appendChild(modalAction);

        if (arcSpyModal.modalBody !== null) {
            arcSpyModal.setModalBody('ArcSpy for LxBot', modalBody);
            return;
        }
        arcSpyModal.createModal('ArcSpy for LxBot', modalBody);
    }

    function savePlayerCookie(userId, sessionId) {
        let cookies = localStorage.getItem("cookies");

        if (cookies === null) {
            cookies = {};
        } else {
            cookies = JSON.parse(cookies);
        }

        cookies[userId] = sessionId;

        localStorage.setItem("cookies", JSON.stringify(cookies));
        return;
    }

    function savePlayerInfo(data) {
        let players = localStorage.getItem("players");

        if (players === null) {
            players = []
        } else {
            players = JSON.parse(players);
        }

        if (players.some(player => player.user_id === data.user_id)) {
            // 如果玩家被缓存了，就更新缓存
            players = players.map(player => player.user_id === data.user_id ? data : player);
        } else {
            // 如果玩家没有被缓存，就添加到缓存中
            players.push(data)
        }

        localStorage.setItem("players", JSON.stringify(players));
        return players;
    }

    function getCachedPlayers() {
        let players = localStorage.getItem("players");

        if (players === null) {
            return [];
        }

        return JSON.parse(players);
    }

    function requestAddFriend(friendCode) {
        return new Promise((resolve, reject) => {
            requestAPI('POST', 'friend/me/add', `friend_code=${friendCode}`).then((response) => {
                resolve(response);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    function initArcSpySidebarButton() {
        let title = document.createElement("span");
        title.innerHTML = "ARCAEA OFFLINE";
        title.setAttribute("data-v-4ca0696e", undefined);
        title.setAttribute("style", "font-weight: bolder; margin-bottom: -12px;");

        let button = document.createElement("a");
        button.classList.add('link-sidebar');
        button.setAttribute("id", "arcspy");
        button.setAttribute("data-v-4ca0696e", undefined);
        button.setAttribute("href", "javascript:void(0)");

        let buttonIcon = document.createElement("img");
        buttonIcon.setAttribute("data-v-4ca0696e", undefined);
        buttonIcon.setAttribute("src", LOGO);
        buttonIcon.setAttribute("style", "https://lxns.net/static/avatar.jpg");

        let buttonText = document.createElement("span");
        buttonText.setAttribute("data-v-4ca0696e", undefined);
        buttonText.innerHTML = "ArcSpy for LxBot";

        button.appendChild(buttonIcon);
        button.appendChild(buttonText);

        let navLink = document.getElementsByClassName("navlink")[1];

        button.addEventListener("click", () => {
            document.getElementsByClassName("button close")[0].click();
            openMainModal();
        });
        navLink.appendChild(title);
        navLink.appendChild(button);
    }

    function setDefaultConfig(reset=false) {
        if (songListUrl === undefined || reset) {
            songListUrl = "https://raw.githubusercontent.com/Arcaea-Infinity/ArcaeaSongDatabase/main/arcsong.json";
            GM_setValue("songListUrl", songListUrl);
        }
        if (scoreQueryInterval === undefined || reset) {
            scoreQueryInterval = 5000;
            GM_setValue("scoreQueryInterval", scoreQueryInterval);
        }
        if (saveCookie === undefined || reset) {
            saveCookie = false;
            GM_setValue("saveCookie", saveCookie);
        }
        if (maxScoreCount === undefined || reset) {
            maxScoreCount = 40;
            GM_setValue("maxScoreCount", maxScoreCount);
        }
    }

    setDefaultConfig();
    syncSongList();

    setInterval(() => {
        if (/profile/.test(location.href)) {
            if (document.getElementById("arcspy") === null) {
                try {
                    // 自动注入 ArcSpy 到侧边栏
                    initArcSpySidebarButton();
                } catch (error) {
                    return;
                }
            }
        }
    }, 500);
})();
