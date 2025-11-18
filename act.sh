#!/bin/bash
# ========================================
# Conda 环境配置脚本
# ========================================
# 环境名称（修改此处即可切换项目）
CONDA_ENV_NAME="xiangqi-app"
CONDA_PATH="C:/Conda"

# 创建环境: conda create -n ${CONDA_ENV_NAME} python=3.12 nodejs=24 -c conda-forge
# 激活环境: source act.sh
# 查看环境: conda info --envs

# 方法1: 使用 conda.bat（在 Git Bash 中更可靠）
eval "$(${CONDA_PATH}/Scripts/conda.exe shell.bash hook)"

# 激活环境
conda activate ${CONDA_ENV_NAME}

# 验证 Python 和 Node.js 版本和路径
echo "环境已激活: ${CONDA_ENV_NAME}"
PYTHON_VERSION=$(python -V 2>&1)
PYTHON_PATH=$(which python)
echo "Python 版本: ${PYTHON_VERSION} ，路径: ${PYTHON_PATH}"

# 获取 Node.js 版本（针对 Git Bash source 模式优化）
# 使用临时文件方法，避免在 source 模式下的命令替换问题
NODE_PATH=$(which node 2>/dev/null || command -v node 2>/dev/null)
NODE_VERSION=""

if [ -n "$NODE_PATH" ] && [ -x "$NODE_PATH" ]; then
    # 创建临时文件来存储 node -v 的输出（Windows 兼容）
    TEMP_NODE_VERSION="${TMP:-/tmp}/node_ver_$$.txt"
    # 确保临时目录存在
    mkdir -p "$(dirname "$TEMP_NODE_VERSION")" 2>/dev/null
    
    # 方法1: 使用临时文件（避免 source 模式下的命令替换问题）
    node -v > "$TEMP_NODE_VERSION" 2>&1
    if [ -f "$TEMP_NODE_VERSION" ] && [ -s "$TEMP_NODE_VERSION" ]; then
        NODE_VERSION=$(cat "$TEMP_NODE_VERSION" | tr -d '\r\n' | grep -oE 'v[0-9]+\.[0-9]+\.[0-9]+' | head -n 1)
        rm -f "$TEMP_NODE_VERSION" 2>/dev/null
    fi
    
    # 方法2: 如果临时文件方法失败，尝试直接命令替换
    if [ -z "$NODE_VERSION" ]; then
        NODE_VERSION=$(node -v 2>&1 | tr -d '\r\n' | grep -oE 'v[0-9]+\.[0-9]+\.[0-9]+' | head -n 1)
    fi
    
    # 方法3: 使用完整路径调用
    if [ -z "$NODE_VERSION" ]; then
        "$NODE_PATH" -v > "$TEMP_NODE_VERSION" 2>&1
        if [ -f "$TEMP_NODE_VERSION" ] && [ -s "$TEMP_NODE_VERSION" ]; then
            NODE_VERSION=$(cat "$TEMP_NODE_VERSION" | tr -d '\r\n' | grep -oE 'v[0-9]+\.[0-9]+\.[0-9]+' | head -n 1)
            rm -f "$TEMP_NODE_VERSION" 2>/dev/null
        fi
    fi
    
    # 清理临时文件
    rm -f "$TEMP_NODE_VERSION" 2>/dev/null
fi

if [ -z "$NODE_VERSION" ]; then
    echo "Node.js 版本: 未找到 ，路径: ${NODE_PATH}"
else
    echo "Node.js 版本: ${NODE_VERSION} ，路径: ${NODE_PATH}"
fi
conda info --envs