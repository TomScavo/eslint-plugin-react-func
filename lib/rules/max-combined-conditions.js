/**
 * @fileoverview Rule to flag use combined conditions
 * @author Lisonglin
 */

"use strict";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const OPTIONS_OR_INTEGER_SCHEMA = {
    type: "integer",
    minimum: 0
};

module.exports = {
    meta: {
        type: "problem",

        docs: {
            description: "disallow combined expressions in conditions",
            category: "Possible Errors",
            recommended: true,
            url: "https://npm"
        },

        schema: [
          OPTIONS_OR_INTEGER_SCHEMA
        ],

        messages: {
            unexpected: "too many combined conditions ({{operatorNum}}). Maximum allowed is {{maxCombination}}."
        }
    },

    create(context) {
        const defaultMaxCombination = 1;
        const option = context.options[0];
        let maxCombination = defaultMaxCombination;
        let operatorNum = 0;

        if (typeof option === "number") {
            maxCombination = option
        }

        function findOperatorNum(node) {
            const { left, right, operator } = node
            const isValidOperator = (left || right) && ['&&', '||'].includes(operator);

            if (isValidOperator) operatorNum++;
            if (left) findOperatorNum(left);
            if (right) findOperatorNum(right);
        }

        function isTooManyCombined(node) {
            operatorNum = 0;
            findOperatorNum(node);
            return operatorNum > maxCombination
        }

        /**
         * Reports when the given node contains a constant condition.
         * @param {ASTNode} node The AST node to check.
         * @returns {void}
         * @private
         */
        function reportIfConstant(node) {
            if (node.test && isTooManyCombined(node.test)) {
                context.report({
                    node: node.test,
                    messageId: "unexpected",
                    data: {
                      maxCombination,
                      operatorNum
                    }
                });
            }
        }

        return {
            ConditionalExpression: reportIfConstant,
            IfStatement: reportIfConstant,
            // WhileStatement: checkLoop,
            // "WhileStatement:exit": checkConstantConditionLoopInSet,
            // DoWhileStatement: checkLoop,
            // "DoWhileStatement:exit": checkConstantConditionLoopInSet,
            // ForStatement: checkLoop,
            // "ForStatement > .test": node => checkLoop(node.parent),
            // "ForStatement:exit": checkConstantConditionLoopInSet,
            // FunctionDeclaration: enterFunction,
            // "FunctionDeclaration:exit": exitFunction,
            // FunctionExpression: enterFunction,
            // "FunctionExpression:exit": exitFunction,
            // YieldExpression: () => loopsInCurrentScope.clear()
        };

    }
};