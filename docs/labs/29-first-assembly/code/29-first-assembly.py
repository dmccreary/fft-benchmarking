# Lab 29: Your First Assembly Function
#
# Assembly is where you stop describing WHAT you want and start naming the
# exact instructions the CPU executes. There is no interpreter, no object
# layer, no type checking. Just registers and operations on them.
#
# It is much less frightening than it sounds. There are about a dozen
# instructions you need, and you already know what all of them do.

import machine
import micropython

machine.mem32[0xE000EDFC] = machine.mem32[0xE000EDFC] | (1 << 24)
machine.mem32[0xE0001000] = machine.mem32[0xE0001000] | 1


def rd():
    return machine.mem32[0xE0001004]


# =========================================================================
# PART 1 -- the smallest possible assembly function
# =========================================================================
print("=== PART 1: add two numbers ===")


@micropython.asm_thumb
def add_two(r0, r1):
    # Arguments arrive in r0, r1, r2, r3 -- in that order.
    # Whatever is in r0 when the function ends is the return value.
    add(r0, r0, r1)


print("add_two(40, 2) =", add_two(40, 2))
print("add_two(-5, 8) =", add_two(-5, 8))
print()
print("Two rules cover almost everything:")
print("  * arguments arrive in r0, r1, r2, r3")
print("  * whatever is in r0 at the end is returned")

# =========================================================================
# PART 2 -- registers are the only variables
# =========================================================================
print()
print("=== PART 2: registers ===")
print()
print("A Cortex-M33 has 16 core registers. You may freely use r0-r7.")
print("There is no 'x = 5' -- there is 'put 5 into register 3'.")
print()


@micropython.asm_thumb
def arithmetic_demo(r0):
    mov(r1, 10)          # r1 = 10
    mov(r2, 3)           # r2 = 3
    add(r3, r1, r2)      # r3 = 13
    sub(r4, r1, r2)      # r4 = 7
    mul(r1, r2)          # r1 = r1 * r2 = 30
    add(r0, r3, r4)      # r0 = 20
    add(r0, r0, r1)      # r0 = 50


print("arithmetic_demo() =", arithmetic_demo(0), " (expect 50)")

# =========================================================================
# PART 3 -- loops are compare-and-branch
# =========================================================================
print()
print("=== PART 3: loops ===")
print()
print("There is no 'for' or 'while'. A loop is a label, some work, a")
print("comparison, and a conditional jump back.")
print()


@micropython.asm_thumb
def sum_to_n(r0):
    # Add up 1 + 2 + ... + n
    mov(r1, 0)                  # total
    mov(r2, 1)                  # counter

    label(LOOP)
    add(r1, r1, r2)             # total += counter
    add(r2, 1)                  # counter += 1
    cmp(r2, r0)                 # compare counter with n
    ble(LOOP)                   # branch back while counter <= n

    mov(r0, r1)                 # return total


for n in (5, 10, 100):
    expected = n * (n + 1) // 2
    got = sum_to_n(n)
    print("sum_to_n(%3d) = %6d   (expect %6d)  %s"
          % (n, got, expected, "ok" if got == expected else "WRONG"))

# =========================================================================
# PART 4 -- reading memory
# =========================================================================
print()
print("=== PART 4: working with arrays ===")
print()
print("Assembly cannot see a Python list. It works with an ADDRESS and")
print("reads words from it. uctypes.addressof() gives us that address.")
print()

from array import array
from uctypes import addressof


@micropython.asm_thumb
def sum_array(r0, r1):
    # r0 = address of an array('i'), r1 = number of elements
    mov(r2, 0)                  # running total
    mov(r3, 0)                  # index

    label(SUM_LOOP)
    lsl(r4, r3, 2)              # index * 4  (each int is 4 bytes)
    add(r4, r0, r4)             # address of element
    ldr(r5, [r4, 0])            # load it
    add(r2, r2, r5)             # add to total
    add(r3, 1)
    cmp(r3, r1)
    blt(SUM_LOOP)

    mov(r0, r2)


data = array("i", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
print("array      :", list(data))
print("sum_array  :", sum_array(addressof(data), len(data)), " (expect 55)")
print()
print("Note 'lsl(r4, r3, 2)' -- shifting left by 2 multiplies by 4, because")
print("each 32-bit integer occupies 4 bytes. Address arithmetic is manual.")

# =========================================================================
# PART 5 -- why bother
# =========================================================================
print()
print("=== PART 5: what it buys you ===")
print()

COUNT = 5000
big = array("i", [i for i in range(COUNT)])


def sum_python(a, n):
    total = 0
    for i in range(n):
        total += a[i]
    return total


def timeit(fn, *args):
    fn(*args)
    best = None
    for _ in range(5):
        s = rd()
        r = fn(*args)
        c = (rd() - s) & 0xFFFFFFFF
        if best is None or c < best:
            best = c
    return best, r


py_c, py_r = timeit(sum_python, big, COUNT)
asm_c, asm_r = timeit(sum_array, addressof(big), COUNT)

print("summing %d integers:" % COUNT)
print("  Python   : %8d cycles  -> %d" % (py_c, py_r))
print("  assembly : %8d cycles  -> %d" % (asm_c, asm_r))
print("  speedup  : %.0fx" % (py_c / asm_c))
print()
print("Same answer. The Python version spends almost all its time unboxing")
print("objects and dispatching bytecode. The assembly version does one")
print("load and one add per element, and nothing else.")

# =========================================================================
# The instruction set you actually need
# =========================================================================
print()
print("=== The dozen instructions that cover most of it ===")
print()
print("  mov(rd, imm)       put a constant in a register")
print("  mov(rd, rn)        copy a register")
print("  add(rd, rn, rm)    rd = rn + rm")
print("  add(rd, imm)       rd = rd + constant")
print("  sub(rd, rn, rm)    rd = rn - rm")
print("  mul(rd, rn)        rd = rd * rn")
print("  lsl(rd, rn, imm)   shift left (multiply by a power of 2)")
print("  lsr(rd, rn, imm)   shift right (divide by a power of 2)")
print("  ldr(rd, [rn, off]) load a 32-bit word from memory")
print("  str(rd, [rn, off]) store a 32-bit word to memory")
print("  cmp(rn, rm)        compare, setting flags")
print("  label(NAME)        mark a position")
print("  b(NAME)            jump")
print("  blt/ble/bgt/bne    jump if the comparison said so")
print()
print("That is genuinely most of it. Next lab adds the floating point set.")
