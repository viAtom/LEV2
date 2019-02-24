import { Component, Input } from '@angular/core';
import { LEAVE_CLASSNAME } from '@angular/animations/browser/src/util';

@Component({
  selector: 'app-lev-header',
  templateUrl: './lev-header.component.html',
  styleUrls: ['./lev-header.component.css']
})
export class LevHeaderComponent {
  @Input() game;
  @Input() playingTeams;
  private akamai = 'https://am-a.akamaihd.net/image/?resize=40:40&f=';
  public imgUrl = `${this.akamai}https%3A%2F%2Flolstatic-a.akamaihd.net%2Fesports-assets%2Fproduction%2Fteam%2F`;

  public LEC = {
    'G2': 'g2-esports-cbnyfbkl.png',
    'S04': 'fc-schalke-04-9cmq9zg4.png',
    'VIT': 'vitality-jdkf3qsj.png',
    'SPY': 'splyce-alf6br1o.png',
    'OG': 'origen-gn2xn19r.png',
    'MSF': 'misfits-8fnvxt30.png',
    'SK': 'sk-gaming-7k42jqfl.png',
    'XL': 'excel-esports-8ncwhony.png',
    'FNC': 'fnatic-dyliu2bm.png',
    'RGE': 'rogue-9d66np2l.png',
  };

  public LCS = {
    'TL': 'team-liquid-8wr6x4o4.png',
    'C9': 'cloud9-gnd9b0gn.png',
    'CLG': 'counter-logic-gaming-gvqf8y59.png',
    'FOX': 'echo-fox-f3anfude.png',
    'FLY': 'flyquest-9t3ydumy.png',
    '100': '100-thieves-4ejlxysw.png',
    'TSM': 'team-solomid-741l0vtg.png',
    'GGS': 'golden-guardians-4ptra55d.png',
    'CG': 'clutch-gaming-74797kth.png',
    'OPT': 'optic-gaming-2hm8y6fl.png',
  };

  public LCK = {
    'GRF': 'griffin-2qnmn9bm.png',
    'SB': 'team-battlecomics-150mx44g.png',
    'SKT': 'sktelecom-t1-ca62upz0.png',
    'KZ': 'kingzone-dragonx-fvg9d02l.png',
    'HLE': 'hanwha-life-esports-cw75wx75.png',
    'GEN': 'geng-qelf7yu.png',
    'DWG': 'damwon-gaming-2eagu86e.png',
    'KT': 'kt-rolster-dv9kvyjx.png',
    'AF': 'afreeca-freecs-2a8dak1f.png',
    'JAG': 'jin-air-green-wings-hc0ywme6.png',
  };

  public LPL = {
    'FPX': 'funplus-phoenix-bbozlifa.png',
    'IG': 'invictus-gaming-fc6pvsnm.png',
    'SN': 'sn-gaming-dpx2lfxk.png',
    'TOP': 'topsports-gaming-hw655g3n.png',
    'JDG': 'qg-reapers-3i6v3997.png',
    'BLG': 'bilibili-gaming-1092q4q0.png',
    'SDG': 'sinodragon-gaming-8iqt8bis.png',
    'EDG': 'edward-gaming-52bsed1a.png',
    'RNG': 'royal-never-give-up-cyacqft1.png',
    'V5': 'victory-five-c5umtiek.png',
    'WE': 'team-we-ei826ceg.png',
    'VG': 'vici-gaming-hzibc6u0.png',
    'OMG': 'omg-7tst61zj.png',
    'RW': 'rogue-warriors-1kvtwjow.png',
    'SS': 'snake-iqttt327.png',
    'LGD': 'lgd-gaming-5n0d69lg.png',
  };

  public TCL = {
    'SUP': 'supermassive-esports-8l3sbui2.png',
    'RYL': 'royal-bandits-e-sports-hzvrfwi5.png',
    'GS': 'galatasaray-esports-bamvqliv.png',
    'FB': '1907-fenerbahce-espor-b5nuqf04.png',
    'BJK': 'besiktas-cpgfvptx.png',
    'AUR': 'team-aurora-s7wbd6e.png',
    'DP': 'dark-passage-1vuiuddo.png',
    'HWA': 'hwa-gaming-hpzupz27.png',
    'GAL': 'galakticos-hqjaw6ig.png',
    'BUR': 'bursaspor-esports-fhdw3a5q.png',
  };

  public CBLOL = {
    'FLA': 'flamengo-esports-j9tg5zop.png',
    'UP': 'idm-gaming-fteacgbn.png',
    'RDP': 'redemption-esports-9un44ycx.png',
    'ITZ': 'intz-ijdoekud.png',
    'VK': 'keyd-stars-i74wmtpq.png',
    'CNB': 'cnb-e-sports-club-18yvbgr0.png',
    'KBM': 'kabum-orange-ebtmnjp.png',
    'PRG': 'progaming-e-sports-10iyfq3l.png',
  };

  public LJL = {
    'DFM': 'detonation-focusme-4a9bzdvg.png',
    'CGA': 'crest-gaming-act-e99302fb.png',
    'USG': 'unsold-stuff-gaming-zrbxiqt.png',
    'BC': 'burning-core-7q0431w1.png',
    'RJ': 'rascal-jester-e0g6cud0.png',
    'V3': 'v3-esports-4r8dffpi.png',
    'SG': 'sengoku-gaming-ikyxjlfn.png',
    'AXZ': 'axiz-frilmkic.png',
  };

  public teams = {
    ...this.LEC,
    ...this.LCS,
    ...this.LCK,
    ...this.LPL,
    ...this.TCL,
    ...this.CBLOL,
    ...this.LJL,
  };

  public teamsArray = Object.values(this.teams);
  constructor() { }
}
