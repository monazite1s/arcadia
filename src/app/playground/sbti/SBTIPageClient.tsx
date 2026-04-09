"use client";

import { useEffect, useState } from "react";

import "./page.css";
import { initSBTIFilter, renderSBTI } from "./sbti.script";

export default function SBTIPageClient() {
    const [dimsOpen, setDimsOpen] = useState(false);
    const [previewCode, setPreviewCode] = useState<string | null>(null);

    useEffect(() => {
        renderSBTI("all");
        initSBTIFilter();

        // 监听卡片的预览事件
        const handler = (e: Event) => {
            const code = (e as CustomEvent).detail;
            if (code) setPreviewCode(code);
        };
        window.addEventListener("sbti-preview", handler);
        return () => window.removeEventListener("sbti-preview", handler);
    }, []);

    return (
        <div className="sbti-page">
            {/* ── Hero ── */}
            <section className="sbti-hero">
                <div className="sbti-hero__glow" />
                <h1>SBTI 人格图鉴</h1>
                <p className="sbti-hero__sub">
                    MBTI 已经过时，SBTI 来了。27 种人格，总有一款拿捏你。
                </p>
                <div className="sbti-hero__stats">
                    标准人格 <b>25</b> &middot; 隐藏人格 <b>1</b> &middot; 兜底人格 <b>1</b>
                </div>
            </section>

            {/* ── About ── */}
            <section className="sbti-about">
                <h2>这是什么？</h2>
                <p>
                    SBTI，全称 <b>Shabi Type Indicator</b>，由 B 站 UP 主
                    @蛆肉儿串儿原创，初衷是劝朋友戒酒，结果一不小心把所有人都骂了一遍。
                </p>
                <p>
                    31 道灵魂拷问，横跨 5 大模型、15
                    个维度，全部在浏览器本地计算——你的回答不会上传到任何服务器。
                    做完后系统会根据你的十五维向量匹配最近的人格，并附赠一份字面意义上的
                    &quot;人格审判书&quot;。
                </p>
                <p>别太当真。但也别不当真。</p>
                <div className="sbti-about__stats">
                    <div className="sbti-about__stat">
                        <b>31</b>
                        <span>灵魂拷问</span>
                    </div>
                    <div className="sbti-about__stat">
                        <b>15</b>
                        <span>评分维度</span>
                    </div>
                    <div className="sbti-about__stat">
                        <b>5</b>
                        <span>人格模型</span>
                    </div>
                    <div className="sbti-about__stat">
                        <b>27</b>
                        <span>人格类型</span>
                    </div>
                </div>
            </section>

            {/* ── Dimensions ── */}
            <section className="sbti-dims">
                <div className="sbti-dims__header">
                    <h2>十五维度说明</h2>
                    <button className="sbti-dims__toggle" onClick={() => setDimsOpen((v) => !v)}>
                        {dimsOpen ? "收起维度 ▲" : "展开维度 ▼"}
                    </button>
                </div>
                <p className="sbti-dims__lead">
                    每道题的选项映射到对应维度的 <span className="sbti-dim-h">H</span>（高）/
                    <span className="sbti-dim-m">M</span>（中）/
                    <span className="sbti-dim-l">L</span>（低）三个等级，两个子题得分相加后换算。
                </p>
                <div className={`sbti-dims__grid${dimsOpen ? "sbti-dims__grid--open" : ""}`}>
                    {/* 自我模型 */}
                    <div className="sbti-dims__card">
                        <h3>自我模型</h3>
                        <div className="sbti-dims__item">
                            <div className="sbti-dims__label">S1 自尊自信</div>
                            <div className="sbti-dims__levels">
                                <span className="sbti-dim-h">H</span>{" "}
                                对自己大致有数，不太被路人一句话打散
                                <br />
                                <span className="sbti-dim-m">M</span>{" "}
                                自信值随天气波动，顺风能飞逆风先缩
                                <br />
                                <span className="sbti-dim-l">L</span>{" "}
                                对自己下手比别人还狠，夸你两句都想验明真伪
                            </div>
                        </div>
                        <div className="sbti-dims__item">
                            <div className="sbti-dims__label">S2 自我清晰度</div>
                            <div className="sbti-dims__levels">
                                <span className="sbti-dim-h">H</span>{" "}
                                对自己的脾气、欲望和底线都算门儿清
                                <br />
                                <span className="sbti-dim-m">M</span>{" "}
                                平时还能认出自己，偶尔被情绪临时换号
                                <br />
                                <span className="sbti-dim-l">L</span>{" "}
                                内心频道雪花较多，常在&quot;我是谁&quot;里循环缓存
                            </div>
                        </div>
                        <div className="sbti-dims__item">
                            <div className="sbti-dims__label">S3 核心价值</div>
                            <div className="sbti-dims__levels">
                                <span className="sbti-dim-h">H</span>{" "}
                                很容易被目标、成长或重要信念推着往前
                                <br />
                                <span className="sbti-dim-m">M</span>{" "}
                                想上进也想躺会儿，价值排序经常内部开会
                                <br />
                                <span className="sbti-dim-l">L</span>{" "}
                                更在意舒服和安全，没必要天天给人生开冲刺模式
                            </div>
                        </div>
                    </div>

                    {/* 情感模型 */}
                    <div className="sbti-dims__card">
                        <h3>情感模型</h3>
                        <div className="sbti-dims__item">
                            <div className="sbti-dims__label">E1 依恋安全感</div>
                            <div className="sbti-dims__levels">
                                <span className="sbti-dim-h">H</span>{" "}
                                更愿意相信关系本身，不被风吹草动吓散
                                <br />
                                <span className="sbti-dim-m">M</span>{" "}
                                一半信任一半试探，感情里常在心里拉锯
                                <br />
                                <span className="sbti-dim-l">L</span>{" "}
                                警报器灵敏，已读不回都能脑补到大结局
                            </div>
                        </div>
                        <div className="sbti-dims__item">
                            <div className="sbti-dims__label">E2 情感投入度</div>
                            <div className="sbti-dims__levels">
                                <span className="sbti-dim-h">H</span>{" "}
                                一旦认定就容易认真，情绪和精力都给得很足
                                <br />
                                <span className="sbti-dim-m">M</span>{" "}
                                会投入但会给自己留后手，不至于全盘梭哈
                                <br />
                                <span className="sbti-dim-l">L</span>{" "}
                                投入偏克制，心门不是没开，是门禁太严
                            </div>
                        </div>
                        <div className="sbti-dims__item">
                            <div className="sbti-dims__label">E3 边界与依赖</div>
                            <div className="sbti-dims__levels">
                                <span className="sbti-dim-h">H</span>{" "}
                                空间感很重要，再爱也得留一块属于自己的地
                                <br />
                                <span className="sbti-dim-m">M</span>{" "}
                                亲密和独立都要一点，属于可调节型依赖
                                <br />
                                <span className="sbti-dim-l">L</span>{" "}
                                容易黏人也容易被黏，关系里的温度感很重要
                            </div>
                        </div>
                    </div>

                    {/* 态度模型 */}
                    <div className="sbti-dims__card">
                        <h3>态度模型</h3>
                        <div className="sbti-dims__item">
                            <div className="sbti-dims__label">A1 世界观倾向</div>
                            <div className="sbti-dims__levels">
                                <span className="sbti-dim-h">H</span>{" "}
                                更愿意相信人性和善意，不急着把世界判死刑
                                <br />
                                <span className="sbti-dim-m">M</span>{" "}
                                既不天真也不彻底阴谋论，观望是本能
                                <br />
                                <span className="sbti-dim-l">L</span>{" "}
                                看世界自带防御滤镜，先怀疑再靠近
                            </div>
                        </div>
                        <div className="sbti-dims__item">
                            <div className="sbti-dims__label">A2 规则与灵活度</div>
                            <div className="sbti-dims__levels">
                                <span className="sbti-dim-h">H</span>{" "}
                                秩序感较强，能按流程来就不爱即兴炸场
                                <br />
                                <span className="sbti-dim-m">M</span>{" "}
                                该守的时候守，该变通的时候也不死磕
                                <br />
                                <span className="sbti-dim-l">L</span>{" "}
                                规则能绕就绕，舒服和自由往往排在前面
                            </div>
                        </div>
                        <div className="sbti-dims__item">
                            <div className="sbti-dims__label">A3 人生意义感</div>
                            <div className="sbti-dims__levels">
                                <span className="sbti-dim-h">H</span>{" "}
                                做事更有方向，知道自己大概要往哪边走
                                <br />
                                <span className="sbti-dim-m">M</span>{" "}
                                偶尔有目标偶尔也想摆烂，人生观处于半开机
                                <br />
                                <span className="sbti-dim-l">L</span>{" "}
                                意义感偏低，容易觉得很多事都像在走过场
                            </div>
                        </div>
                    </div>

                    {/* 行动驱力模型 */}
                    <div className="sbti-dims__card">
                        <h3>行动驱力</h3>
                        <div className="sbti-dims__item">
                            <div className="sbti-dims__label">Ac1 动机导向</div>
                            <div className="sbti-dims__levels">
                                <span className="sbti-dim-h">H</span> 更容易被成果、成长和推进感点燃
                                <br />
                                <span className="sbti-dim-m">M</span>{" "}
                                有时想赢有时只想别麻烦，动机比较混合
                                <br />
                                <span className="sbti-dim-l">L</span>{" "}
                                做事先考虑别翻车，避险系统比野心更先启动
                            </div>
                        </div>
                        <div className="sbti-dims__item">
                            <div className="sbti-dims__label">Ac2 决策风格</div>
                            <div className="sbti-dims__levels">
                                <span className="sbti-dim-h">H</span>{" "}
                                拍板速度快，决定一下就不爱回头磨叽
                                <br />
                                <span className="sbti-dim-m">M</span>{" "}
                                会想但不至于想死机，属于正常犹豫
                                <br />
                                <span className="sbti-dim-l">L</span>{" "}
                                做决定前容易多转几圈，脑内会议常常超时
                            </div>
                        </div>
                        <div className="sbti-dims__item">
                            <div className="sbti-dims__label">Ac3 执行模式</div>
                            <div className="sbti-dims__levels">
                                <span className="sbti-dim-h">H</span>{" "}
                                推进欲比较强，事情不落地心里都像卡了根刺
                                <br />
                                <span className="sbti-dim-m">M</span> 能做但状态看时机，偶尔稳偶尔摆
                                <br />
                                <span className="sbti-dim-l">L</span>{" "}
                                执行力和死线有深厚感情，越晚越像要觉醒
                            </div>
                        </div>
                    </div>

                    {/* 社交模型 */}
                    <div className="sbti-dims__card">
                        <h3>社交模型</h3>
                        <div className="sbti-dims__item">
                            <div className="sbti-dims__label">So1 社交主动性</div>
                            <div className="sbti-dims__levels">
                                <span className="sbti-dim-h">H</span>{" "}
                                更愿意主动打开场子，在人群里不太怕露头
                                <br />
                                <span className="sbti-dim-m">M</span>{" "}
                                有人来就接没人来也不硬凑，社交弹性一般
                                <br />
                                <span className="sbti-dim-l">L</span>{" "}
                                社交启动慢热，主动出击通常得攒半天气
                            </div>
                        </div>
                        <div className="sbti-dims__item">
                            <div className="sbti-dims__label">So2 人际边界感</div>
                            <div className="sbti-dims__levels">
                                <span className="sbti-dim-h">H</span>{" "}
                                边界感偏强，靠太近会本能性后退半步
                                <br />
                                <span className="sbti-dim-m">M</span>{" "}
                                既想亲近又想留缝，边界感看对象调节
                                <br />
                                <span className="sbti-dim-l">L</span>{" "}
                                更想亲近和融合，熟了就容易把人划进内圈
                            </div>
                        </div>
                        <div className="sbti-dims__item">
                            <div className="sbti-dims__label">So3 表达与真实度</div>
                            <div className="sbti-dims__levels">
                                <span className="sbti-dim-h">H</span>{" "}
                                对不同场景的自我切换更熟练，真实感会分层发放
                                <br />
                                <span className="sbti-dim-m">M</span>{" "}
                                会看气氛说话，真实和体面通常各留一点
                                <br />
                                <span className="sbti-dim-l">L</span> 表达更直接，心里有啥基本不爱绕
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Filter ── */}
            <div className="sbti-filter" id="sbtiFilter">
                <button className="active" data-f="all">
                    全部 (27)
                </button>
                <button data-f="self">自我模型</button>
                <button data-f="emotion">情感模型</button>
                <button data-f="attitude">态度模型</button>
                <button data-f="action">行动驱力</button>
                <button data-f="social">社交模型</button>
                <button data-f="special">特殊人格</button>
            </div>

            {/* ── Grid ── */}
            <div className="sbti-grid" id="sbtiGrid" />

            {/* ── Footer ── */}
            <footer className="sbti-footer">
                原作者：B站 @蛆肉儿串儿 &middot; 测试地址：
                <a href="https://sbti.unun.dev/" target="_blank" rel="noopener noreferrer">
                    sbti.unun.dev
                </a>{" "}
                &middot; 本页面仅供娱乐，别当真
            </footer>

            {/* ── Preview Modal ── */}
            {previewCode && (
                <div className="sbti-modal" onClick={() => setPreviewCode(null)}>
                    <div className="sbti-modal__inner" onClick={(e) => e.stopPropagation()}>
                        <button className="sbti-modal__close" onClick={() => setPreviewCode(null)}>
                            &times;
                        </button>
                        <iframe
                            className="sbti-modal__iframe"
                            src={`/sbti-test.html?type=${encodeURIComponent(previewCode)}`}
                            title={`SBTI ${previewCode} 结果预览`}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
